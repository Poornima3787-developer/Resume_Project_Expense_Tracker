const express=require('express');
const db=require('./utils/db-connection');
const userRoutes=require('./routes/userRoutes');
const cors=require('cors');

const app=express();

app.use(express.json());
app.use(cors());

app.use('/user',userRoutes);

db.sync({ force: true }).then(()=>{
app.listen(3000,()=>{
  console.log('server is running');
})
}).catch((err)=>{
  console.log(err);
})
