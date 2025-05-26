const express=require('express');
const router=express.Router();
const purchaseController=require('../controllers/purchaseController');
const authenticate=require('../middleware/auth');

router.post('/pay',authenticate,purchaseController.createOrder);
router.get('/payment-status/:orderId',authenticate,purchaseController.getPaymentStatus);

module.exports=router;