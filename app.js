const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const errorController = require('./controllers/error');
const User = require('./models/User');
const Expenses = require('./models/expense');
const Order = require('./models/orders');
const ForgotPassword = require('./models/forgotpassword');
const FileUrls = require('./models/downloadfileUrl');

const userRoutes= require('./routes/details');
const expenseRoutes = require('./routes/expenses');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premiumFeacher');
const resetPasswordRoutes = require('./routes/resetPassword');

// Middleware
app.use(cors());
app.use(helmet( {
   contentSecurityPolicy: false
}));
app.use(express.json());
app.use(bodyParser.json({ extended: false }));

// Routes
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', resetPasswordRoutes);

// Catch-all route
app.use((req, res) => {
   console.log('url>>>>>>>>',req.url) 
   res.sendFile(path.join(__dirname,'frontendPage',req.url))
});

// Associations
// User.hasMany(Expenses);
// Expenses.belongsTo(User);
// User.hasMany(Order);
// Order.belongsTo(User);
// User.hasMany(ForgotPassword);
// ForgotPassword.belongsTo(User);
// User.hasMany(FileUrls);
// FileUrls.belongsTo(User);

// 404 Error Handling
app.use(errorController.get404);

// Database Sync and Server Start
mongoose.connect('mongodb+srv://kayathri:Njs8vSgQfSp933j5@cluster0.crjgy7j.mongodb.net/expensetracker?retryWrites=true&w=majority&appName=Cluster0')
  .then(() =>{
   app.listen(3000);
   console.log('connected!');
})
 .catch( err => console.log(err));
