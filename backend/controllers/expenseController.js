const Expense=require('../models/expense');

const getExpenses=async (req ,res)=>{
  try {
    const expenses=await Expense.findAll();
    res.status(200).json({ expenses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
}

const addExpenses=async (req ,res)=>{
  const {amount,description,category}=req.body;
  if(amount == undefined || amount.length === 0 ){
        return res.status(400).json({success: false, message: 'Parameters missing'})
    }
  try {
    const newExpense=await Expense.create({amount,description,category});
     res.status(201).json({ message: 'Expense added', expense: newExpense });
  } catch (error) {
     console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const deleteExpenses=async (req ,res) =>{
  const expenseId=req.params.id;
  console.log('Deleting expense ID:', expenseId);
  if(expenseId == undefined || expenseId.length === 0){
        return res.status(400).json({success: false, })
    }
  try {
    const deleted = await Expense.destroy({where:{id:expenseId}});
    if (deleted) {
      res.status(200).json({ message: 'Expense deleted successfully' });
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Error deleting expense' });
  }
}

module.exports={
  getExpenses,
  addExpenses,
  deleteExpenses
}