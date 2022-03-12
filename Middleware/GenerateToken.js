const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

const GenerateToken = async()=>{ 
    const token = await jwt.sign({_id : "lsjlsjflm234km3jlkj54k3l5l"} , jwt_secret , {
        expiresIn:"2000 seconds"
    });
    console.log(token);

    const userVer = await jwt.verify(token, jwt_secret)
    console.log(userVer);

}

module.exports = GenerateToken;