require('dotenv').config();

console.log('🔑 App ID:',    process.env.CASHFREE_APP_ID ? 'FOUND' : 'MISSING');
console.log('🔒 Secret Key:', process.env.CASHFREE_SECRET_KEY ? 'FOUND' : 'MISSING');
const express=require('express');
const sequelize=require('./utils/db-connection');
const userRoutes=require('./routes/userRoutes');
const expenseRoutes=require('./routes/expenseRoutes');
const purchaseRoutes=require('./routes/purchaseRoutes');
const User=require('./models/user');
const Expense=require('./models/expense');
const cors=require('cors');

const app=express();

app.use(express.json());
app.use(cors());

app.use('/user',userRoutes);
app.use('/expenses',expenseRoutes);
app.use('/',purchaseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

/*User.hasMany(Order);
Order.belongsTo(User);*/

sequelize.sync({force:true})
    .then(() => {
        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch(err => {
        console.error('Database sync failed:', err);
    });