const {DataTypes}=require('sequelize');
const sequelize=require('../utils/db-connection');

const ForgotPassword=sequelize.define('ForgotPassword',{
  id:{
    type:DataTypes.UUID,
    allowNull:false,
    primaryKey:true
  },
  active:DataTypes.BOOLEAN,
  expiresby: {
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: () => new Date(Date.now() + 3600000) 
}
})

module.exports=ForgotPassword;