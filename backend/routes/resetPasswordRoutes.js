const express=require('express');
const router=express.Router();
const resetPasswordController=require('../controllers/resetPasswordController');

router.post('/forgotpassword',resetPasswordController.forgotpassword);
router.post('/updatepassword/:id',resetPasswordController.updatepassword);
router.get('/resetpassword/:id',resetPasswordController.resetpassword); 

module.exports=router;