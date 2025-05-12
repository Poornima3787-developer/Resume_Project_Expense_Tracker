const User=require('../models/user');
const bcrypt=require('bcrypt');

const userSignup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
    const existingUser= await User.findOne({where:{email}});

    if (existingUser){
      return res.status(409).json({ message: 'User already exists' });
    }
    
    const saltrounds=10;
    bcrypt.hash(password,saltrounds,async (err,hash)=>{
      console.log(err);
      await User.create({name,email,password:hash});
      res.status(201).json({ message: 'User registered successfully' });
    })
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

    bcrypt.compare(password,user.password,(err,result)=>{
      if(err){
        res.status(500).json({success:'false',message:'User password is not same'})
      }
      if(result===true){
       return res.status(200).json({ message: 'User login successful' });
      }
      else{
        return res.status(401).json({ message: 'User not authorized' });
      }
    }) 

   } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
   }

}

module.exports={
  userSignup,
  userLogin
}