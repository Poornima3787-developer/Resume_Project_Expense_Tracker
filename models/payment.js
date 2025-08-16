const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true 
  },
  paymentSessionId: {
    type: String,
    required: true
  },
  orderAmount: {
    type: Number,
    required: true
  },
  orderCurrency: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    required: true,
    default: 'Pending'
  },
  UserId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
})
module.exports = mongoose.model('Payment', paymentSchema);


