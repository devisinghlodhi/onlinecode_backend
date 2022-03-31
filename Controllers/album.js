const express = require('express')
const User = require("../Models/User");
const bcrypt = require('bcrypt');
const GenerateToken = require('../Middleware/GenerateToken');
const jwt = require("jsonwebtoken");
const { generateFile } = require('./generateFile');
const {executeCpp} = require('./executeCpp');
const jwt_secret = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
    let { userName, MobileNo, Email, Password } = req.body;

    try {
        const userExist = await User.findOne({ Email: Email })
        if (userExist) {
            res.status(422).json({ error: "Email Already Exist" })
        } else {
            const user = new User({ userName, MobileNo, Email, Password })

            await user.save().then((data) => {
                res.status(200).json({
                    message: 'Data Successfully Saved...',
                    result: 'success'
                })
            }).catch((err) => {
                res.send(err);
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }

};


exports.login = async (req, res) => {

    let { Email, Password } = req.body;

    const userExist = await User.findOne({ Email: Email })
    if (userExist) {
        let token;
        let userpass = userExist.Password;
        let checkpass = await bcrypt.compare(Password, userpass);

        // let currToken = req.cookies.token;
        // console.log("Current token value : ", currToken);

        if (checkpass) {

            token = await userExist.generateAuthToken();
            console.log("token is : ", token);

            // res.cookie("token", token, {
            //     expires: new Date(Date.now() + 25892000000),
            //     httpOnly: true,
            //     // secure:true
            // });


            res.status(200).json({
                message: "Login Successfully",
                result: "success",
                token: token,
            })
        } else {
            res.status(422).json({
                error: "Incorrect Password",
                result: "fail"
            })
        }
    } else {
        res.status(422).json({ error: "This Email id dosen't Registered" })
    }

};






exports.alreadylogin = async (req, res) => {

    res.status(200).json({ login: "success" });
}






exports.runprogram = async (req, res) => {

    let { language = "cpp", code } = req.body;

    try {
        const filepath = await generateFile(language, code);

        const output = await executeCpp(filepath);
        // const output = "hii";
    
        res.status(200).json({ filepath, output });
    } catch (error) {
        res.status(500).json({error});
    }
   


}