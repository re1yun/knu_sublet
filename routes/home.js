// routes/home.js

module.exports = function(app){
    var express = require('express');
    var route = express.Router();
    var Post = require('../models/post');
    
    route.get('/',function(req, res){
        Post.find({})
                .sort('-createdAt')     //작성한 순서대로 정렬하여서,
                .exec(function(err, posts){         //posts 변수에 array로 저장 - find는 항상 array 반환
                    if(err) console.log(err);
                    res.render('index', {
                        title: "main_page",
                        posts:posts
                    });
                    // if(req.session.user){
                    //     res.render('index', {
                    //         title: "main_page",
                    //         isLogin: true,
                    //         currentUser: req.session.user.id,
                    //         posts:posts
                    //     })    
                    // }else{
                    //     res.render('index', {
                    //         title: "main_page",
                    //         isLogin: false,
                    //         posts:posts
                    //     })
                    // }
                });
    });

    return route;
};