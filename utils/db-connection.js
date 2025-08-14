require('dotenv').config();

const mongoose=require('mongoose');

const connectDB=async ()=>{
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connection established successfully!');
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

module.exports=connectDB;