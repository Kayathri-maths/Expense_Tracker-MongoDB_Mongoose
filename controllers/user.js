const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


function isstringinvalid(str) {
  if (str == undefined || str.length === 0) {
    return true;
  } else {
    return false;
  }
}


const signup = async (req, res, next) => {
  try {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phonenumber = req.body.phonenumber;

    if (isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password) || isstringinvalid(phonenumber)) {
      return res.status(400).json({ err: "Bad Parameters, Something is missing" });
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      await User.create({ name: name, email: email, password: hash, phonenumber: phonenumber , ispremiumuser: false});
      res.status(201).json({ message: 'Successfully created new User' });
    })
  }
  catch (error) {
    res.status(500).json({
      error: error
    });
  }

};

const generateAccessToken = (id, name, ispremiumuser) =>{
  return jwt.sign( { userId: id , name: name, ispremiumuser} , process.env.TOKEN_SECRET)
}

const login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (isstringinvalid(email) || isstringinvalid(password)) {
      return res.status(400).json({ message: "Email or password is missing", success: false });
    }
    const user = await User.findOne({ email: email});
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          throw new Error('Something went wrong');
        }
        if (result === true) {
           return res.status(200).json({ success: true, message: "User logged in successfully" , token: generateAccessToken(user._id,user.name, user.ispremiumuser)});
        } else {
          return res.status(400).json({ success: false, message: "Password is incorrect" });
        }
      });
    } else {
      return res.status(404).json({ success: false, message: "User doesn't exist" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
}

module.exports = {
  signup,
  login,
  generateAccessToken
}