const express = require('express');
const router = express.Router();
const passport = require('passport')

const { createUsers,home,getLogin,loginPost,secret,register,getRegister,forgot,otpPost,logout } =require('../controller/usercontroller');

// router.route('/login').post(loginUser);
router.route('/secret').get(secret);
router.route('/home').get(home);
router.route('/login').get(getLogin).post(loginPost);
router.route('/register').post(createUsers).get(getRegister);
router.route('/forgot').post(forgot);
router.route('/otp-verify').post(otpPost);
router.route('/logout').post(logout)
module.exports = router