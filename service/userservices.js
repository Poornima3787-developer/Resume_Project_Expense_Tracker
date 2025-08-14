const Expense = require('../models/expense');

const getExpenses=(req,where={})=>{
  return Expense.find({userId:req.user._id,...where})
}

module.exports={
  getExpenses
}