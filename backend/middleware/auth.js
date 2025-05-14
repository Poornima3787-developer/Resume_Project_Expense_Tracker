const jwt=require('jsonwebtoken');
const User=require('../models/user');

const authenticate=async (req,res,next)=>{
 
    const token=req.header('Authorization');
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }
    console.log('Received token:', token);
     try {
    const decoded = jwt.verify(token, 'secretKeysecretKey');
    req.user=decoded;
    next();
  }catch (error) {
    console.log(error);
    return res.status(401).json({success:false});
  }
}

module.exports={
  authenticate,
};