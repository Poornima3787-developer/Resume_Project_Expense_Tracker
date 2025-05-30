const {DataTypes}=require('sequelize');
const sequelize=require('../utils/db-connection');

const User=sequelize.define('User',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    allowNull:false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  email:{
    type:DataTypes.STRING,
    unique:true,
    allowNull:false
  },
  password:{
    type:DataTypes.STRING,
    allowNull:false
  },
  isPremium: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},
total_cost: {
  type: DataTypes.INTEGER,
  defaultValue: 0
}
});

module.exports=User;