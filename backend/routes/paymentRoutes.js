const express = require('express');
const router = express.Router();
const {  processPayment, getPaymentStatus } = require('../controllers/paymentController');
const authenticate=require('../middleware/auth');


router.post('/pay',authenticate, processPayment);
router.get('/payment-status/:paymentSessionId', getPaymentStatus);

module.exports = router;