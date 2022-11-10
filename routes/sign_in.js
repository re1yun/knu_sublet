module.exports = function(app){
    var express = require('express');
    var router = express.Router();
    var passport = require('passport');
    //var LocalStrategy = require('passport-local');
    var User = require('../models/user');

    // passport.use('local-login', new LocalStrategy({
    //     usernameField: 'ID',
    //     passwordField: 'PW',
    //     //passReqToCallback: true
    // },
    // function(username, password, done){
    //     User.findOne({userID:username})
    //         .select({password:1})
    //         .exec(function(err, user){
    //             if(err) return done(err);

    //             if(user && user.authenticate(password)){
    //                 return done(null, user);
    //             }
    //             else{
    //                 return done(null, false);
    //             }
    //         });
    // }
    // ));

    router.route('/')
        .get(function(req, res){
            res.render('index',{
                title: 'users/sign_in',
            })
            // if(req.session.user){
            //     res.send("<script>alert('로그인 상태 입니다');location.href=history.back();</script>");
            // }
            // else{
            //     res.render('index', {
            //         title: 'login',
            //     })
            // }
        })
        .post(function(req, res){
            console.log("we have a login request for: " + req.body.ID + " and passwd of: " + req.body.PW);
            User.findOne({userID : req.body.ID, password : req.body.PW}, function(err, result){
                console.log("searching exisiting users");
                if(err || result != null){
                    if(err) console.log("we have error at findOne function");
                    else console.log("we found user with %s %s", result.userID, result.password);
                    req.session.user = {
                        id: req.body.ID,
                        pw: req.body.PW,
                        authorized: true
                    };
                    // res.render('index', {
                    //     title: "main_page",
                    //     isLogin: true,
                    //     posts:posts
                    // })
                    //res.redirect('/');
                    res.send("<script>alert('로그인 성공!');location.href='/';</script>");
                }
                if(!result){
                    console.log("no existing user - please sign up");
                    res.send("<script>alert('유저 정보가 없습니다. 회원가입 해주세요');location.href='sign_up';</script>");
                }
            })
        })
    ;
    return router;
};