const User=require('../models/user');
const Expense=require('../models/expense');
const sequelize=require('../utils/db-connection');

exports.getUserLeaderBoard=async (req , res)=>{
  try {
    const leaderboardofUsers=await User.findAll({order:[['total_cost','DESC']]});
     
   res.status(200).json(leaderboardofUsers); 
    
  } catch (error) {
    console.log(error);
    res.status(500).json('leaderboard error');
  }
}

