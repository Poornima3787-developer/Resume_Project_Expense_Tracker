require('dotenv').config();
const jwt=require('jsonwebtoken');
const User=require('../models/user');

const authenticate=async (req,res,next)=>{
  const authHeader = req.header('Authorization');
 const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication token missing' });
  }

  try {   
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
     const user=await User.findByPk(decoded.userId);
     if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

     req.user = user;
    next(); 
  
  }catch (error) {
  
    
    res.status(401).json({ success: false});
  }
}

module.exports=authenticate;