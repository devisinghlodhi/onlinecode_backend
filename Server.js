require("dotenv").config();
const express = require('express')
var cors = require('cors')
// const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const auth = require('./Middleware/auth');
const GenerateToken = require('./Middleware/GenerateToken');

const app = express();

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("DB CONNECT");
    // auth();
    GenerateToken();
});


// app.use(bodyParser.JSON());
app.use(cookieParser());
app.use(cors());


const port = process.env.PORT;
app.listen(port,() => console.log(`Server up and running on port! ${port}`));
