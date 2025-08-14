const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  active: {
    type: Boolean,
    default: true
  },
  expiresby: {
    type: Date,
    default: () => new Date(Date.now() + 3600000)
  }
});

module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema);
