const Expense=require('../models/expense');

const getExpenses=async (req ,res)=>{
  try {
    const expenses=await Expense.findAll({where:{UserId:req.user.id}})

    res.status(200).json({success: true ,expenses});
  } catch (error) {

    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
}

const addExpenses=async (req ,res)=>{
  const {amount,description,category}=req.body;
  if (!amount || !description || !category) {
    return res.status(400).json({ success: false, message: 'Amount is required' });
  }
  try {
    const newExpense=await Expense.create({amount,description,category,UserId:req.user.id});
   
     res.status(201).json({ message: 'Expense added', expense: newExpense });
  } catch (error) {

    res.status(500).json({ message: 'Internal server error' });
  }
}

const deleteExpenses=async (req ,res) =>{
  const expenseId=req.params.id;
  if (!expenseId) {
    return res.status(404).json({ message: 'Expense not found or unauthorized' });
  }
  try {
    const deleted = await Expense.destroy({where:{id:expenseId,UserId:req.user.id}});
    if (deleted) {
      res.status(200).json({ message: 'Expense deleted successfully' });
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
   
    res.status(500).json({ message: 'Error deleting expense' });
  }
}

module.exports={
  getExpenses,
  addExpenses,
  deleteExpenses
}