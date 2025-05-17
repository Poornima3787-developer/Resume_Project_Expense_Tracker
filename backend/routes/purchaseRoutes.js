const express=require('express');
const router=express.Router();
const purchaseController=require('../controllers/purchaseController');

router.post('/pay',purchaseController.createOrder);
router.get('/payment-status/:orderId',purchaseController.getPaymentStatus);

module.exports=router;