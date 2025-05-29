const path = require("path");
const {
  createOrder,
  getPaymentStatus,
} = require("../services/cashfreeService");
const Payment = require("../models/payment");
const User=require('../models/user');

exports.getPaymentPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../view/expense.html"));
};

exports.processPayment = async (req, res) => {
                                                                                                                    
  const orderId = "ORDER-" + Date.now();
  const orderAmount = 2000;
  const orderCurrency = "INR";
  const customerID = "1";
  const customerPhone = "9999999999";

  try {
    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      customerID,
      customerPhone,
    );
    await Payment.create({
      orderId,
      paymentSessionId,
      orderAmount,
      orderCurrency,
      paymentStatus: "Pending",
     // UserId: req.user.id
    });

    res.json({ paymentSessionId, orderId });
  } catch (error) {
    // console.error("Error processing payment:", error.message);
    res.status(500).json({ message: "Error processing payment" });
  }
};

exports.getPaymentStatus = async (req, res) => {
  
  const paymentSessionId = req.params.paymentSessionId; 
  console.log();
  console.log();
   console.log(paymentSessionId);
   console.log();
   console.log();
  try {
    const orderStatus = await getPaymentStatus(paymentSessionId);
    console.log();
    console.log();
   console.log(orderStatus);
   console.log();
   console.log();
     const order = await Payment.findOne({where:{ paymentSessionId}} );
     order.paymentStatus  = orderStatus;
     await order.save();
    if(orderStatus==='Success'){
      const user = await User.findByPk(req.user.id);
      if (user) {
    user.isPremium = true;
    await user.save();
  }
     }

    res.json({orderStatus})
   
  } catch (error) {
    // console.error("Error fetching payment status:", error.message);
    res.status(500).json({ message: "Error fetching payment status" });
  }
};  