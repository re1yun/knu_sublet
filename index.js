//index.js

const express = require("express");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var passport = require("./config/passport");
var expressSession = require('express-session');
var imagekit = require('imagekit');
var util = require('./util');
require('dotenv').config();

//express setting
//app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.engine("html", require("ejs").renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(
  expressSession({
    secret: "my key",
    resave: true,
    saveUninitialized: true,
  })
)
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

//모든 request에 대해서 로그인 상태 확인 및 현재 유저 저장
app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

//routes
app.use("/", util.getPostQueryString, require('./routes/home')(app));
app.use("/post", util.getPostQueryString, require('./routes/post')(app));
app.use("/user", require('./routes/user')(app));


//DB configuration
var db = mongoose.connection;
db.on('error', err => {
  console.log(err);
});
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

// imagekit configuration
var imagekit = new imagekit({
  publicKey : process.env.IMAGEKIT_PUB,
  privateKey : process.env.IMAGEKIT_PRIV,
  urlEndpoint : process.env.IMAGEKIT_END
});

app.locals.imagekit = imagekit;

//server starts
var server = app.listen(3000, function(){
  console.log("서버 시작: http://127.0.0.1:3000/ ");
});