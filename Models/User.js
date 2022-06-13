const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

var mongoose = require("mongoose");
const bcrypt = require('bcrypt');
var userScheema = new mongoose.Schema(
    {
        userName: {
            type: String,
            maxlength: 200,
            trim: true
        },

        MobileNo: {
            type: String,
            maxlength: 11,
            trim: true
        },
        Email: {
            type: String,
            maxlength: 200,
            trim: true
        },
        Password: {
            type: String,
            maxlength: 300,
            trim: true
        },
        tokens: [
            {
                token: {
                    type: String
                }
            }
        ]
    },
    { timestamps: true }
);


userScheema.pre('save', async function (next) {
    // console.log("inside of bcrypt")
    if (this.isModified('Password')) {
        this.Password = await bcrypt.hash(this.Password, 12)
    }
    next();
})


userScheema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, jwt_secret);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        console.log(error)
    }
} 


module.exports = mongoose.model("User", userScheema);
