const {Sequelize}=require('sequelize');

const sequelize=new Sequelize('expense_db','root','Poornima@3787',{
  host:'localhost',
  dialect:'mysql'
});


module.exports=sequelize;