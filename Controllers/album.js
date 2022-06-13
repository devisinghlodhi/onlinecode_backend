const express = require('express')
const User = require("../Models/User");
const Job = require("../Models/job");
const bcrypt = require('bcrypt');
const GenerateToken = require('../Middleware/GenerateToken');
const jwt = require("jsonwebtoken");
const { generateFile } = require('./generateFile');
const {executeCpp} = require('./executeCpp');
const {executePy} = require('./executePy');
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

};


exports.alreadylogin = async (req, res) => {
    res.status(200).json({ login: "success" });
}



exports.logout = async (req, res) => {
    let { token } = req.body;
    const userinfo = await jwt.verify(token, jwt_secret);
    let userdetails = await User.findOne({_id:userinfo._id});

    userdetails.tokens = userdetails.tokens.filter((currElm, index, arr)=>{ 
        return currElm.token != token;
    });

    await userdetails.save();
  
    res.status(200).json({ status: "success", message: "Logout Successfully" })

};




exports.runprogram = async (req, res) => {
    let { language = "cpp", code } = req.body;
    let job;
    try {
        const filepath = await generateFile(language, code);

        job = await new Job({language, filepath}).save()
        const jobId = job["_id"];
        console.log(job);
        res.status(201).json({success:true, jobId})

        let output="";

        job["startedAt"] = new Date();
        if(language == "cpp"){
            output = await executeCpp(filepath);
        }else{
            output = await executePy(filepath);
        }

        job["completedAt"] = new Date();
        job["status"] = "success";
        job["output"] = output;

        await job.save();

        console.log(job )
        // res.status(200).json({ filepath, output });
    } catch (error) {
        job["completedAt"] = new Date();
        job["status"] = "error";
        job["output"] = JSON.stringify(error)
        await job.save();

        console.log(job);
        // res.status(500).json({error});
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

