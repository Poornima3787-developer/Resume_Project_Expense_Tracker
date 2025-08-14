require('dotenv').config();
const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

function generateAccessToken(id,name){
  return jwt.sign({userId:id,name:name},process.env.TOKEN_SECRET,{ expiresIn: '12h' });
}

const userSignup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
    const existingUser= await User.findOne({where:{email}});

    if (existingUser){
      return res.status(409).json({ message: 'User already exists' });
    }
    
    const saltRounds=10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user=new User({ name, email, password: hashedPassword });
    await user.save();

    const token = generateAccessToken(user._id, user.name);

   res.status(201).json({ message: 'User created successfully',token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const userLogin = async (req ,res) =>{
   const {email,password}=req.body;

   try {
    const user=await User.findOne({where:{email}});
    
    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch=await bcrypt.compare(password,user.password);

     if (!isMatch) {
        return res.status(401).json({ message: 'User password is wrong' });
     }

    const token = generateAccessToken(user._id, user.name);

     return res.status(200).json({
       message: 'User login successful',
       token: token
    });
   } 
   catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: 'Internal server error' });
   }
}

const premiumStatus=async(req,res)=>{
  try{
  const user=await User.findById(req.user.id).select(isPremium);
  if (!user) {
      return res.status(404).json({ message: 'User not found' });
  }
  res.json({isPremium:user.isPremium})
  }catch (error) {
    res.status(500).json({ message: 'Payment status error' });
  }
}

module.exports={
  userSignup,
  userLogin,
  generateAccessToken,
  premiumStatus
}