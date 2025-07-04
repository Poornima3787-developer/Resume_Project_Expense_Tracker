
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
      UserId:req.user.id
    });

    res.json({ paymentSessionId, orderId });
  } catch (error) {
   
    res.status(500).json({ message: "Error processing payment" });
  }
};

exports.getPaymentStatus = async (req, res) => {
  
  const paymentSessionId = req.params.paymentSessionId; 
 // console.log(paymentSessionId);
  try {
    const orderStatus = await getPaymentStatus(paymentSessionId);
  // console.log(orderStatus);
     const order = await Payment.findOne({ where: { orderId:paymentSessionId } } );
    // console.log(order);
     order.paymentStatus  = orderStatus;
     await order.save();
    
    if(orderStatus==='Success'){
      const user = await User.findByPk(order.UserId);
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