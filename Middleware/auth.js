const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;
const User = require("../Models/User");

const Auth = async(req, res, next) => {
    let currToken = req.body.token;
    
    try {
        const userinfo = await jwt.verify(currToken, jwt_secret);
        let userdetails = await User.findOne({_id:userinfo._id});
        
        let alltokens = userdetails.tokens.map((item)=>{ return item.token });

        if(userinfo && alltokens.includes(currToken)){
            next();
        }else{
            res.status(422).json({login : "failed", error: "Login Expired" })
        }
    } catch (error) {
        res.status(422).json({login : "failed", error: "Login Expired" , errors : error})
    }
}

module.exports = Auth;



