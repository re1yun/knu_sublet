const express = require("express");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require("passport");
var expressSession = require('express-session');
var fs = require('fs');

//express setting
//app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.engine("html", require("ejs").renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

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

app.use("/", require('./routes/home')(app));
app.use("/sign_in", require('./routes/sign_in')(app));
// app.use("/sign_up", require('./routes/sign_up')(app));
// app.use("/logout", require('./routes/logout')(app));
// app.use("/write", require('./routes/write')(app));
app.use("/post", require('./routes/post')(app));
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
mongoose.connect('mongodb://localhost/test');

//server starts
var server = app.listen(3000, function(){
  console.log("서버 시작: http://127.0.0.1:3000/ ");
});