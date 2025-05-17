require('dotenv').config();
const Order=require('../models/order');
const cashfreeService=require('../services/cashfreeService');

exports.createOrder=async (req ,res) =>{
  try {
    const userId=req.user?.id||1;
    const orderId='order_'+Date.now();
    const customerPhone="9999999999";
    const orderAmount = 1.00;

    const paymentSessionId=await cashfreeService.createOrder(
      orderId,
      orderAmount,
      "INR",
      userId.toString(),
      customerPhone
    );

    await Order.create({
      orderId,
      userId,
      paymentSessionId,
      status:'PENDING',
    });

    return res.status(200).json({ paymentSessionId, orderId });

  } catch (error) {
    console.error('🔥 createOrder failed:', error);
    return res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

exports.getPaymentStatus= async(req,res)=>{
  try {
    const {orderId}=req.params;
    const status=await cashfreeService.getPaymentStatus(orderId);
    const order=await Order.findOne({where:{orderId}});
    if(order){
      order.status=status;
      await order.save();
    }
     res.json({ orderStatus: status });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payment status" });
  }
}