const express=require('express');
const router=express.Router();
const expenseController=require('../controllers/expenseController');
const authenticate=require('../middleware/auth');

router.post('/',authenticate,expenseController.addExpenses);
router.get('/',authenticate,expenseController.getExpenses);
router.delete('/:id',authenticate,expenseController.deleteExpenses);

router.get('/download',authenticate,expenseController.downloadExpense);
router.get('/download/history',authenticate,expenseController.getDownloadHistory);

module.exports=router;