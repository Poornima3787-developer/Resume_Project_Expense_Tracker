const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
  name: { 
    type: String,
     required: true
   },
  email: {
     type: String,
      required: true,
       unique: true
    },
  password: {
     type: String, 
     required: true 
    },
  isPremium: { 
    type: Boolean,
     default: false 
    },
  total_cost:{
    type:Number,
    required:true
  }
});

module.exports=mongoose.model('User',userSchema);
