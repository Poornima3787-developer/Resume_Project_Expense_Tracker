require('dotenv').config();
const jwt=require('jsonwebtoken');
const User=require('../models/user');

const authenticate=async (req,res,next)=>{
  const token = req.header('Authorization');
  try {   
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
     const user=await User.findByPk(decoded.userId);
   if (!user) return res.status(401).json({ message: 'User not found' });
     req.user = user;
    next(); 
  
  }catch (error) {
    console.error('Authentication error:', error.name);
    
    const message = error.name === 'JsonWebTokenError' 
      ? 'Invalid token'
      : error.name === 'TokenExpiredError'
        ? 'Token expired'
        : 'Authentication failed';

    res.status(401).json({ success: false, message });
  }
}

module.exports=authenticate;