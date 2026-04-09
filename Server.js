require("dotenv").config();
const express = require('express')
var cors = require('cors')
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
});


app.use(express.urlencoded({extended:true}));
app.use(express.json())

app.use(bodyParser.json());
app.use(cookieParser());
// app.use(cors());


const be_url = process.env.API_URL
const fe_url = process.env.FRONTEND_URL

app.use(
    cors({
      origin: [`https://${be_url}`, `http://${be_url}`, `https://${fe_url}`, `http://${fe_url}` ],
      credentials: 'true',
    })
  );
    
// app.use(function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000', 'https://onlinecodecompiler.vercel.app', 'https://onlinecodecompiler-devisinghlodhi1999-gmailcom.vercel.app');
    
//     res.setHeader('Access-Control-Allow-Credentials',true);
//     // res.setHeader('Access-Control-Allow-Credentials',false);
//     // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
//   });


app.use("/api",albumsRoutes )

app.use("/", async(req, res)=>{
console.log('hello world')
res.send('Hello world');
})

   
const port = process.env.PORT;

app.listen(port,() => console.log(`Server up and running on port! ${port}`));
