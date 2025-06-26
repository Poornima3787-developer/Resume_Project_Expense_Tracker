require('dotenv').config();
const uuid = require('uuid');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
const User=require('../models/user');
const ForgotPassword=require('../models/forgotPassword')

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.Email_API_KEY;

const forgotpassword=async (req,res)=>{
  try {
    const {email}=req.body;
    const user=await User.findOne({where:{email}});
     if (!user) return res.status(404).json({ message: 'User does not exist' });
            const id = uuid.v4();
           await user.createForgotPassword({ id , active: true })
           const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
             await apiInstance.sendTransacEmail({
      sender: { email: 'poornimaaragala@gmail.com', name: 'ExpenseTrackerApp' },
      to: [{ email }],
      subject: 'Reset your password',
      htmlContent: `<p>Click here to reset your password: <a href="http://localhost:3000/password/resetpassword/${id}">Reset Password</a></p>`,
    });
    res.status(202).json({ message: 'Reset link sent to email', success: true });
  } catch (error) {
     console.error(error)
        return res.json({ message: error, sucess: false });
  }
}

const resetpassword=async (req,res)=>{
  const id=req.params.id;
  try{
 const request= await ForgotPassword.findOne({where:{id}})
 if (!request || !request.active) {
      return res.status(404).send('Link is invalid or expired');
    }
    await request.update({ active: false });
  res.status(200).send(`<html>
             <form action="/password/updatepassword/${id}" method="POST">
             <label>Enter New Password:</label>
  <input type="password" name="newpassword" required />
  <button type="submit">Reset Password</button>
</form>

      </html>`)
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
}

const updatepassword=async (req,res)=>{
  try {
    const { newpassword } = req.body;
        const { id } = req.params;
        const resetRequest=await ForgotPassword.findOne({ where : {  id}});
        if (!resetRequest) return res.status(404).json({ error: 'Reset request not found' });
        const user=await User.findOne({where: { id : resetRequest.UserId}});
        if (!user) return res.status(404).json({ error: 'User not found' });
         
       const hashedPassword = await bcrypt.hash(newpassword, 10);
    await user.update({ password: hashedPassword });
    await resetRequest.update({ active: false });
    res.status(201).json({ message: 'Password successfully updated' });
  } catch (error) {
       console.error(error);
    res.status(500).json({ error: 'Password update failed' });
  }
}

module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}