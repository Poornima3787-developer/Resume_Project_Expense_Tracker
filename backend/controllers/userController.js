const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

function generateAccessToken(id,name){
  return jwt.sign({userId:id,name:name},'secretKeysecretKey');
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
   await User.create({ name, email, password: hashedPassword });
   res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('SignUp error:', error);
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
  return res.status(401).json({ message: 'User not authorized' });
}
return res.status(200).json({ message: 'User login successful', token: generateAccessToken(user.id, user.name) }) 

   } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
   }

}

module.exports={
  userSignup,
  userLogin,
  generateAccessToken
}