require('dotenv').config();
const Expense=require('../models/expense');
const User=require('../models/user');
const sequelize=require('../utils/db-connection');
const UserServices=require('../service/userservices');
const S3Service=require('../service/S3services');
const DownloadedFile = require('../models/downloadedFile');

const getExpenses=async (req ,res)=>{
  const page=+req.query.page||1;
  const limit=+req.query.limit||10;
  const userId=req.user.id;
  try {
    const totalItems=await Expense.count({where:{userId}});
    const expenses=await Expense.findAll({
      where:{UserId:userId},
      offset:(page-1)*limit,
      limit:limit,
      order:[['createdAt','DESC']],
      })
    res.json({
      expenses,
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
  const t= await sequelize.transaction();
  const {amount,description,category,note}=req.body;
  if (!amount || !description || !category) {
    return res.status(400).json({ success: false, message: 'Amount is required' });
  }
  try {
    const newExpense=await Expense.create({amount,description,category,note,UserId:req.user.id},{transaction:t});
    const user = await User.findByPk(req.user.id);
    const total_cost=Number(user.total_cost)+Number(amount);
    console.log(req.user.total_cost);
     await User.update({total_cost:total_cost},{where:{id:req.user.id},transaction:t});
     await t.commit();
     res.status(201).json({ message: 'Expense added', expense: newExpense });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Internal server error' });
  }
}

const deleteExpenses=async (req ,res) =>{
  const expenseId=req.params.id;
  if (!expenseId) {
    return res.status(404).json({ message: 'Expense not found or unauthorized' });
  }
  const t = await sequelize.transaction();
  try {
    const expense = await Expense.findOne({
      where: { id: expenseId, UserId: req.user.id },
      transaction: t
    });
     if (!expense) {
      await t.rollback();
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }
     await expense.destroy({ transaction: t });
await User.decrement('total_cost', {
      by: expense.amount,
      where: { id: req.user.id },
      transaction: t
    });

    await t.commit();
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Error deleting expense' });
  }
}

const downloadExpense=async (req,res)=>{
  try{
  const expenses=await UserServices.getExpenses(req);
  //console.log(expenses);
  const stringifiedExpenses=JSON.stringify(expenses);
  const userId=req.user.id;
  const filename=`Expense${userId}/${new Date()}.txt`;
  const fileURL= await S3Service.uploadToS3(stringifiedExpenses,filename);

  await DownloadedFile.create({
      UserId:userId,
      fileUrl: fileURL,
      downloadDate: new Date()
    });

  res.status(200).json({fileURL,success:true})
  }catch(error){
    console.log(error);
    res.status(500).json({fileURL:'',success:true,error:error});
  }
}

const getDownloadHistory=async (req,res)=>{
  try {
    const userId=req.user.id;
    const history=await DownloadedFile.findAll({
      where:{userId},
      order:[['downloadDate','DESC']],
    });
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