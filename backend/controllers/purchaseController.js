require('dotenv').config();
const Order=require('../models/order');
const User=require('../models/user');
const cashfreeService=require('../services/cashfreeService');

exports.createOrder=async (req ,res) =>{
  try {
     console.log("User info from req.user:", req.user);
    if (!req.user || !req.user.id) {
  return res.status(401).json({ message: 'User not authenticated' });
}
     const UserId = req.user.id;
    const orderId='order_'+Date.now();
    const customerPhone=req.user.phone||"9999999999";
    const orderAmount = req.body.amount||1.00;
    const customerID = req.user.id.toString();

    const paymentSessionId=await cashfreeService.createOrder(
      orderId,
      orderAmount,
      'INR',
      customerID,
      customerPhone,
  );

    await Order.create({
      orderId,
      UserId,
      paymentSessionId,
      status:'PENDING',
    });

    return res.status(200).json({ paymentSessionId, orderId });

  } catch (error) {
    console.error('createOrder failed:', error);
    return res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

exports.getPaymentStatus= async(req,res)=>{
  try{
 const {orderId}=req.params;
 const userId=req.user.id;
 const status = await cashfreeService.getPaymentStatus(orderId);
    const order = await Order.findOne({ where: { orderId, UserId: userId } });
 if (order.status !== status) {
      await order.update({ status });
      if (status === 'PAID') {
    await User.update(
      { isPremium: true },
      { where: { id: req.user.id } }
    )
    }
  }
    res.json({ orderStatus: status });
 
  } catch (error) {
    console.error(" Payment status check failed:", error);
    res.status(500).json({ error: "Failed to fetch payment status" });
  }
}

