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
    // console.error('Authentication error:', error.name);
    let message = 'Invalid token';
    if (error.name === 'TokenExpiredError') message = 'Token expired';
    if (error.name === 'JsonWebTokenError') message = 'Malformed token';
    
    res.status(401).json({ success: false, message });
  }
}

module.exports=authenticate;