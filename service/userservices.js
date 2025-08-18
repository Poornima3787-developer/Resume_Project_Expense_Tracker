const Expense = require('../models/expense');

const getExpenses=(req,where={})=>{
  return Expense.find({user:req.user._id,...where})
}

module.exports={
  getExpenses
}