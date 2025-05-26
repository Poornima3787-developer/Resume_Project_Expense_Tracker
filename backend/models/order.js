const {DataTypes}=require('sequelize');
const sequelize=require('../utils/db-connection');

const Order=sequelize.define('Order',{
    id:{
      type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  paymentSessionId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED'),
    allowNull: false,
    defaultValue: 'PENDING',
  }
})
module.exports=Order;