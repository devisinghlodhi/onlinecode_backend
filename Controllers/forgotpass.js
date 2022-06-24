const express = require('express')
const User = require("../Models/User");
const Job = require("../Models/job");
const bcrypt = require('bcrypt');
const GenerateToken = require('../Middleware/GenerateToken');
const jwt = require("jsonwebtoken");
const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp');
const { executePy } = require('./executePy');
const jwt_secret = process.env.JWT_SECRET;
var nodemailer = require('nodemailer');


exports.sendforgotlink = async (req, res) => {
  let { hosturl, email } = req.body;

  try {

    const userExist = await User.findOne({ Email: email })
    if (!userExist) {
      res.status(502).json({ status: "error", message: "This Email id does not registered." })
    } else {

      let token = jwt.sign({ email: email }, jwt_secret, { expiresIn: (60 * 5) });

      userExist.emailToken = token;
      await userExist.save();

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS
        }
      });

      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Forgot Passowrd by Link',
        text: `Click on this link to Forgot Password - ${hosturl}/${token}     Link will be Expire in - 5 Minutes.`
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.status(501).json({ status: "error", message: error })
        } else {
          console.log('Email sent: ' + info.response);
          res.json({ status: "success", message: "Email Successfully Sent to email id" })
        }
      });

    }

  } catch (error) {
    console.log(error);
    res.status(502).json({ status: "error", message: error })
  }

};




exports.verifyemailtoken = async (req, res) => {
  let { token } = req.body;
  try {

     jwt.verify(token, jwt_secret, async (err, userinfo)=> {
      if (err) {
        res.json({ status: "failed", message: "Link is expired." })
      } else {
        const userData = await User.findOne({ Email: userinfo.email })
        if (userData.emailToken == token) {
          res.json({ status: "success", message: "Email Link Verified" })
        } else {
          res.json({ status: "failed", message: "Link is expired." })
        }
      }
    });

  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error })
  }

};



exports.forgotchangepassword = async (req, res) => {
  let { token, password } = req.body;

  try {
    const userinfo = await jwt.verify(token, jwt_secret);
    const currUser = await User.findOne({ Email: userinfo.email })

    if (!currUser) {
      res.status(502).json({ status: "error", message: "This Email id does not registered." })
    } else {

      currUser.Password = password;
      currUser.emailToken = '';
      await currUser.save();

      res.json({ status: "success", message: "Password successfully saved" })
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({ status: "error", message: error })
  }

};

