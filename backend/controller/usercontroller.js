const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const saltRounds = 10;
const passport = require('passport')


exports.createUsers = async (req, res) => {
    try {
        const { name, email, password, avatar, role, resetPasswordToken, resetPasswordExpire } = req.body;

        if (!name || !email || !password) {
            return res.send("all fields are required");
        }

        bcrypt.genSalt(saltRounds,  (err, salt)=> {
            // console.log(salt);
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    res.send(err)
                } else {

                    const userData = await User.create({

                        name: name,
                        email: email,
                        password: hash,
                        avatar: avatar,
                        role: role,
                        resetPasswordToken: resetPasswordToken,
                        resetPasswordExpire: resetPasswordExpire


                    })
                    req.login(userData, function (err) {
                        if (err) {
                            console.log(err);
                            return res.redirect('/login');
                        }
                        //   res.cookie('uid',uid)
                        return res.redirect('secret');
                    });

                }
            });
        });


    } catch (error) {
        res.status(201).json({
            success: false,
            error
        })
    }

}
exports.getLogin = async (req, res) => {
    try {
        res.send("login page")
    } catch (error) {
        res.send("err msg")
    }
}
exports.home = async (req, res) => {
    console.log(req.session.otp);
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const userone = await User.findOne({ email: email })
    const hash = userone.password;

    function validateUser(hash) {
        bcrypt
            .compare(password, hash)
            .then(result => {
                if (result) return res.status(201).json({
                    success: true,

                })
            })
            .catch(err => console.error(err.message))
    }
    validateUser(hash)
}
exports.loginPost = ((req, res, next) => {
    passport.authenticate('local', { failureRedirect: '/api/v1/login' }, (err, user, info) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (!user) {
        console.log(info.message);
        return res.status(401).json({ message: info.message });
      }

      req.logIn(user, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal server error' });
        }

        console.log('Login successful');
        return  res.json({
            success: true,
            user: {
                name: user.name,
                _id:user._id
              },
            message:"login successfull"
        });
      });
    })(req, res, next);
  });


exports.secret = (req, res) => {
    if (req.isAuthenticated()) {
        res.send("secret");
    } else {
        res.redirect('/api/v1/login');
    }
}

exports.register = async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    const user = await User.create(req.body);
    req.login(user, function (err) {
        if (err) {
            console.log(err);
            return res.redirect('/login');
        }
        //   res.cookie('uid',uid)
        return res.redirect('secret');
    });
}

exports.getRegister = (req, res) => {
    res.send("register page")
}
exports.forgot = async (req, res) => {
    const email = req.body.email;
    const otp = Math.floor(Math.random() * 900000) + 100000;
    // console.log(otp);

    req.session.otp = otp;
    req.session.email = email;

    // Define the expiration time in milliseconds (e.g., 1 minute)
    const expirationTime = 40000;

    // Remove the token from the session after the expiration time
    setTimeout(() => {
        delete req.session.otp;
        req.session.save(); // Save the session after removing the token
      }, expirationTime);

    // const user = await User.findOneAndUpdate(
    //     { email: email },
    //     { $set: { otp: otp } },
    //     { new: true }
    // );

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'fardindeveloper1@gmail.com', // generated ethereal user
            pass: 'AcpNgL3Z8qHjBztP', // generated ethereal password
        },
    });

    // send mail with defined transport object
    try {
        let info = await transporter.sendMail({
            from: '"Fred Foo" <fardindeveloper1@gmail.com>', // sender address
            to: 'fardinmustaque99@gmail.com', // recipient email address
            subject: "Password Reset OTP", // Subject line
            text: `Your OTP is: ${otp}`, // plain text body
        });

        console.log("Message sent: %s", info.messageId);

        
        
        // Message sent: <messageId>

        res.json({
            success: true,
            info,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to send email.",
        });
    }


};

exports.otpPost = async(req,res)=>{
    console.log("post otp "+req.session.otp);
  if(req.session.otp == req.body.otp){
    console.log("equal valid");
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPass = await bcrypt.hash(req.body.password,salt);
    const user = await User.findOneAndUpdate(
        { email: req.session.email },
        { $set: { password: hashPass } },
        { new: true }
    );

   res.send(user)
  }else{
    res.send("session expired")
  }
}

exports.logout =(req,res,next)=>{
    req.logout(function(err) {
      if (err) { return next(err); }
      res.status(200).json({
        success:true,
        user:"logged out"
      })
    });
  }
