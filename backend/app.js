require('dotenv').config();

const express=require('express');
const path = require('path');
const sequelize=require('./utils/db-connection');
const userRoutes=require('./routes/userRoutes');
const expenseRoutes=require('./routes/expenseRoutes');
const paymentRoutes=require('./routes/paymentRoutes');
const premiumFeaturesRoutes=require('./routes/premiumFeaturesRoutes');
const resetpasswordRoutes=require('./routes/resetPasswordRoutes');
const User=require('./models/user');
const Expense=require('./models/expense');
const Payment=require('./models/payment');
const ForgotPassword=require('./models/forgotPassword');
const cors=require('cors');

const app=express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/user',userRoutes);
app.use('/expenses',expenseRoutes);
app.use('/',paymentRoutes);
app.use('/premium',premiumFeaturesRoutes);
app.use('/password',resetpasswordRoutes);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/view', express.static(path.join(__dirname, 'view')));

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Payment);
Payment.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
             console.log('Server running on port 3000');
        });
    })
    .catch(err => {
        // console.error('Database sync failed:', err);
    });