require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');

// DB & Routes
const sequelize = require('./utils/db-connection');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const premiumFeaturesRoutes = require('./routes/premiumFeaturesRoutes');
const resetpasswordRoutes = require('./routes/resetPasswordRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Models
const User = require('./models/user');
const Expense = require('./models/expense');
const Payment = require('./models/payment');
const ForgotPassword = require('./models/forgotPassword');
const DownloadedFile=require('./models/downloadedFile')

const app = express();

// Middleware: compression + logging
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login',(req,res)=>{
  res.sendFile(path.join(__dirname, 'view','login.html'))
});

app.get('/signup',(req,res)=>{
  res.sendFile(path.join(__dirname, 'view','signup.html'))
});

// Routes
app.use('/user', userRoutes);
app.use('/expenses', expenseRoutes);
app.use('/', paymentRoutes);
app.use('/premium', premiumFeaturesRoutes);
app.use('/password', resetpasswordRoutes);
app.use('/report', reportRoutes);

// Associations
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Payment);
Payment.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

User.hasMany(DownloadedFile);
DownloadedFile.belongsTo(User);

app.get('/',(req,res)=>{
  res.send('server is running');
})
// Start Server
sequelize.sync()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT ,() => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database sync failed:', err);
  });
