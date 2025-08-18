const {createOrder,getPaymentStatus} = require("../service/cashfreeService");
const Payment = require("../models/payment");
const User=require('../models/user');

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
      UserId:req.user._id
    });

    res.json({ paymentSessionId, orderId });
  } catch (error) {
   
    res.status(500).json({ message: "Error processing payment" });
  }
};

exports.getPaymentStatus = async (req, res) => {
  
  const {orderId}= req.params; 

  try {
    const orderStatus = await getPaymentStatus(orderId);
     const order = await Payment.findOne({ orderId}  );
     order.paymentStatus  = orderStatus;
     await order.save();
    
    if(orderStatus==='Success'){
      const user = await User.findById(order.UserId);
      if (user) {
    user.isPremium = true;
    await user.save();

  }
     }
    res.json({orderStatus})   
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment status" });
  }
};  