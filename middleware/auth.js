require('dotenv').config();
const jwt=require('jsonwebtoken');
const User=require('../models/user');

const authenticate=async (req,res,next)=>{
  const authHeader = req.header('Authorization');
 const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.redirect('/login');
  }

  try {   
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
     const user=await User.findByPk(decoded.userId);
     if (!user) {
      return res.status(401).redirect('/login');
    }

     req.user = user;
    next(); 
  
  }catch (error) {
  
    
    res.status(401).redirect('/login');
  }
}

module.exports=authenticate;