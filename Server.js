require("dotenv").config();
const express = require('express')
var cors = require('cors')
// const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const albumsRoutes = require("./Routes/album");

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


app.use(express.urlencoded({extended:true}));
app.use(express.json())

// app.use(bodyParser.JSON());
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(cors());

app.use(
    cors({
      origin: [`http://localhost:3000`, `https://localhost:3000`],
      credentials: 'true',
    })
  );

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials',true);
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });


app.use("/api",albumsRoutes )




const port = process.env.PORT;
app.listen(port,() => console.log(`Server up and running on port! ${port}`));
