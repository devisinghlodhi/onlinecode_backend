const express = require('express')
const User = require("../Models/User");
const Job = require("../Models/job");
const bcrypt = require('bcrypt');
const GenerateToken = require('../Middleware/GenerateToken');
const jwt = require("jsonwebtoken");
const {addJobToQueue} = require("./jobQueue")
const { generateFile } = require('./generateFile');
const {executeCpp} = require('./executeCpp');
const {executePy} = require('./executePy');
const {executeJavascript} = require('./executeJavascript');
const { executeJava } = require('./executeJava');
const { executeGo } = require('./executeGo');
const { executeR } = require('./executeR');
const { executeRuby } = require('./executeRuby');
const { executeKotlin } = require('./executeKotlin');
const { executePhp } = require('./executePhp');
const { executeCsharp } = require('./executeCsharp');
const { executeSwift } = require('./executeSwift');


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
                res.status(502).send(err);
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }

};


exports.login = async (req, res) => {

    let { Email, Password } = req.body;

    try {
        const userExist = await User.findOne({ Email: Email })
    if (userExist) {
        let token;
        let userpass = userExist.Password;
        let checkpass = await bcrypt.compare(Password, userpass);

        if (checkpass) {

            token = await userExist.generateAuthToken();
            console.log("token is : ", token);

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
    } catch (error) {
        console.log(error)
        res.status(422).json({ error: "Something went wrong", msg: error })
    }
    

};


exports.alreadylogin = async (req, res) => {
    let { token } = req.body;
    console.log(req.body)
  try {

    console.log("auth token is : ", token)
    const userinfo = await jwt.verify(token, jwt_secret);
    let userdetails = await User.findOne({_id:userinfo._id});

    let alltoken = userdetails.tokens.map((item)=>{
        return item.token
    })

    if(alltoken.includes(token)){
        console.log({ status: "success", message: "user verified" });
        res.json({ status: "success", message: "user verified" })
    }else{
        console.log({ status: "error", message: "user logout please login" });
        res.json({ status: "error", message: "user logout please login" })
    }

  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error })
  }
}

exports.logout = async (req, res) => {
    let { token } = req.body;

    try {
        const userinfo = await jwt.verify(token, jwt_secret);
    let userdetails = await User.findOne({_id:userinfo._id});

    userdetails.tokens = userdetails.tokens.filter((currElm, index, arr)=>{ 
        return currElm.token != token;
    });

    await userdetails.save();
  
    res.status(200).json({ status: "success", message: "Logout Successfully" })

    } catch (error) {
        res.status(200).json({ status: "error", message: error })
    }

};




exports.runprogram = async (req, res) => {
    let { language = "cpp", code } = req.body;
    let job;
    try {
        const filepath = await generateFile(language, code);

        job = await new Job({language , filepath}).save()
        const jobId = job["_id"];

        addJobToQueue(jobId);

        console.log(job);
        res.status(201).json({success:true, jobId})

    }catch(err){
        console.log("error is :",err);
        return res.status(500).json({success:false , err : JSON.stringify(err)})
    }
}





exports.status = async (req, res) =>{
    const jobId = req.query.id;
    console.log("status requested", jobId)

    if(jobId==undefined){
        return res.status(400).json({success:false, error: "missing id query para"});
    }
    
    try {
        const job =await Job.findById(jobId);

        if(job === undefined || job==null){
            return res.status(404).json({success:false, error: "Invalid Job Id"})
        }

        return res.status(200).json({success:true , job})

    } catch (err) {
        return res.status(400).json({success:false, error: JSON.stringify(err)});
    }

}

