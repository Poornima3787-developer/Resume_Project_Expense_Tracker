const express=require('express');
const sequelize=require('./utils/db-connection');
const userRoutes=require('./routes/userRoutes');
const expenseRoutes=require('./routes/expenseRoutes');
const User=require('./models/user');
const Expense=require('./models/expense');
const cors=require('cors');

const app=express();

app.use(express.json());
app.use(cors());

app.use('/user',userRoutes);
app.use('/expenses',expenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

/*User.hasMany(Order);
Order.belongsTo(User);*/

sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch(err => {
        console.error('Database sync failed:', err);
    });