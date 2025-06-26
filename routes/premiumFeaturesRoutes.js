const express=require('express');
const router=express.Router();
const premiumFeaturesController=require('../controllers/premiumFeaturesController');
const authenticate=require('../middleware/auth');

router.get('/leaderboard',authenticate,premiumFeaturesController.getUserLeaderBoard);

module.exports=router;