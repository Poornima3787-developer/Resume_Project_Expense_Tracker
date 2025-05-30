const express=require('express');
const router=express.Router();
const premiumFeaturesController=require('../controllers/premiumFeaturesController');

router.get('/leaderboard',premiumFeaturesController.getUserLeaderBoard);

module.exports=router;