const User=require('../models/user');

exports.getUserLeaderBoard=async (req , res)=>{
  try {
    const leaderboardofUsers=await User.find()
    .sort({total_cost:-1})
    .select("name total_cost")     
    res.status(200).json(leaderboardofUsers); 
    
  } catch (error) {
    console.log(error);
    res.status(500).json('leaderboard error');
  }
}

