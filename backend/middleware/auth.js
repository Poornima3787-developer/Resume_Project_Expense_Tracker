require('dotenv').config();
const jwt=require('jsonwebtoken');
const User=require('../models/user');

const authenticate=async (req,res,next)=>{
  const authHeader = req.header('Authorization');
const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {   
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
     const user=await User.findByPk(decoded.userId);
     req.user = user;
    next(); 
  
  }catch (error) {
  
    
    res.status(401).json({ success: false});
  }
}

module.exports=authenticate;