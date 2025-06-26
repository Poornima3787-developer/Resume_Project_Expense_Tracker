const express=require('express');
const router=express.Router();
const userController=require('../controllers/userController');
const authenticate=require('../middleware/auth');

router.post('/signup',userController.userSignup);
router.post('/login',userController.userLogin);
router.get('/status',authenticate,userController.premiumStatus);

module.exports=router;