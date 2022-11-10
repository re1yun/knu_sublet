// routes/sign_up.js

module.exports = function(app){
    var express = require('express');
    var router = express.Router();
    //var User = require('../models/user');

    router.route('/')
        .get(function(req, res){
            // if(req.session.user){
            //     res.send("<script>alert('로그인된 상태임');location.href='/';</script>");
            // }
            // else{
            //     res.render('index', {
            //         title: 'sign_up'
            //     })
            // }

            res.render('index', {
                title: 'users/sign_up'
            })
        })
        // .post(function(req, res){
        //     console.log("new signup for " + req.body);
        //     User.create(req.body, function(err, user){
        //         if(err) return console.log(err);
        //         res.send("<script>alert('회원가입 성공!');location.href='login';</script>");
        //     });

            // User.findOne({userID : user.userID}, function(err, result){
            //     console.log("searching exisiting users");
            //     if(err || result != null){
            //         if(err) {
            //             console.log("we have error at findOne function");
            //         }
            //         else {
            //             console.log("we already have %s %s", result.userID, result.password);
            //         }
            //         res.send("<script>alert('이미 존재하는 유저입니다');location.href='sign_up';</script>");
            //     }
            //     if(!result){
            //         console.log("no existing user - proceed to save function");
            //         user.save(function(err){
            //             if(err){
            //                 console.log("we have error at save function");    
            //             }
            //             res.send("<script>alert('회원가입 성공!');location.href='login';</script>");
            //         });
            //     }
            // })
        //})
        ;
    return router;
};