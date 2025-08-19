require('dotenv').config();
const Expense=require('../models/expense');
const User=require('../models/user');

const UserServices=require('../service/userservices');
const S3Service=require('../service/S3services');
const DownloadedFile = require('../models/downloadedFile');
const { default: mongoose } = require('mongoose');

const getExpenses=async (req ,res)=>{
  const page=+req.query.page||1;
  const limit=+req.query.limit||10;
  const userId=req.user._id;
  try {
    const totalItems=await Expense.countDocuments({user:userId});
    const expenses=await Expense.find({user: userId})
      .skip((page-1)*limit)
      .limit(limit)
      .sort({createdAt:-1})
    
    const mappedExpenses = expenses.map(e => ({
      id: e._id,
      amount: e.amount,
      description: e.description,
      category: e.category,
      note: e.note,
      createdAt: e.createdAt
    }));
    
    res.json({
      expenses:mappedExpenses,
      currentPage: page,
      hasNextPage: limit * page < totalItems,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (error) {
     console.error(error);
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
}

const addExpenses=async (req ,res)=>{
  const session=await mongoose.startSession();
  session.startTransaction();
  const {amount,description,category,note}=req.body;

  if (!amount || !description || !category) {
    return res.status(400).json({ success: false, message: 'Amount is required' });
  }

  try {
    const newExpense=new Expense({amount,description,category,note,user:req.user._id});

    await newExpense.save({session});

    const user = await User.findByIdAndUpdate(req.user._id,{
      $inc:{total_cost:Number(amount)}},{session},
    );
     await session.commitTransaction();
     session.endSession();
     res.status(201).json({ message: 'Expense added', expense: newExpense });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Internal server error' });
  }
}

const deleteExpenses=async (req ,res) =>{
  const session = await mongoose.startSession();
  session.startTransaction();
  const expenseId=req.params.id;

  if (!expenseId) {
    return res.status(404).json({ message: 'Expense not found or unauthorized' });
  }

  try {
    const expense = await Expense.findOne({
       _id: expenseId, user: req.user._id 
    }).session(session);

     if (!expense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

     await expense.deleteOne({session});

     await User.findByIdAndUpdate(req.user._id,{
      $inc:{total_cost:-Number(expense.amount)}
     },{session});
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Error deleting expense' });
  }
}

const downloadExpense=async (req,res)=>{
  try{
  const expenses=await UserServices.getExpenses(req);
  const stringifiedExpenses=JSON.stringify(expenses);
  const userId=req.user._id;
  const filename=`Expense${userId}/${new Date()}.txt`;
  const fileURL= await S3Service.uploadToS3(stringifiedExpenses,filename);

  const downloadedFile=new DownloadedFile({
      user:userId,
      fileUrl: fileURL,
      downloadDate: new Date()
    });
  await downloadedFile.save();
  res.status(200).json({fileURL,success:true})
  }catch(error){
    console.log(error);
    res.status(500).json({fileURL:'',success:true,error:error});
  }
}

const getDownloadHistory=async (req,res)=>{
  try {
    const history=await DownloadedFile.find({
      user:req.user._id})
      .sort({downloadedDate:-1});
    res.status(200).json({history});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch download history' });
  }
}

module.exports={
  getExpenses,
  addExpenses,
  deleteExpenses,
  downloadExpense,
  getDownloadHistory
}