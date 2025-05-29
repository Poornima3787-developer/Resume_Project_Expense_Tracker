const express = require('express');
const router = express.Router();
const { getPaymentPage, processPayment, getPaymentStatus } = require('../controllers/paymentController');
const authenticate=require('../middleware/auth');

router.get('/', getPaymentPage);
router.post('/pay', processPayment);
router.get('/payment-status/:paymentSessionId', getPaymentStatus);

module.exports = router;