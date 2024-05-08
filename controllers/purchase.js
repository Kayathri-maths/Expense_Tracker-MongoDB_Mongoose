const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/User');
const userController = require('../controllers/user');


const purchasepremium = async (req, res, next) => {
  try {
   var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })
    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      Order.create({ orderid: order.id, status: 'PENDING', userId: req.user._id}).then(() => {
        return res.status(201).json({ order, key_id: rzp.key_id });
      }).catch(err => {
        console.log('order creation error:',err);
       return res.status(500).json({ error: err})
      })
    })
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went Wrong", error: err })
  }
}

const updateTransactionStatus = async (req, res, next) => {
   try{
   const userId = req.user._id;
    const {payment_id, order_id} = req.body;
    const order = await Order.findOne({orderid: order_id})
    const promise1 = order.updateOne({ paymentid: payment_id, status: 'SUCCESSFUL', userId: req.user_id})
    const promise2 = User.updateOne({_id: req.user._id},{ ispremiumuser: true});
     
    Promise.all([promise1, promise2]).then(() => {

      return res.status(202).json({success: true, message: "Transaction Successfull", token: userController.generateAccessToken(userId, req.user.name, true)});
    }).catch((error) => {
      throw new Error(error)
    })

   }  catch(err){
        console.log(err);
        res.status(403).json({ error:err, message: "something went wrong"})
   }
}

module.exports = {
  purchasepremium,
  updateTransactionStatus
}