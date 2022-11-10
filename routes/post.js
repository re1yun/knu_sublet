//routes/post.js

module.exports = function(app){
    var express  = require('express');
    var router = express.Router();
    var Post = require('../models/post');

    router.route('/new')
        .get(function(req, res){
            // if(req.session.user){
            //     console.log(req.session.user);
            //     res.render('index', {
            //         title: 'post_write',
            //         currentUser: req.session.user.id
            //     });
            // }
            // else{
            //     res.send("<script>alert('로그인 후 사용할 수 있습니다');location.href='/';</script>");
            // }
            res.render('index', {
                title: 'posts/post_write'
            })
        })
        .post(function(req, res){
            Post.create(req.body, function(err, post){
                if(err) return res.json(err);
                res.redirect('/');
            });
        })
    ;
    
    router.route('/:id')
        .get(function(req, res){
            console.log(req.session.user);
            Post.findOne({_id:req.params.id}, function(err, post){
                if(err) console.log(err);
                res.render('index', {
                    title: 'posts/post_show',
                    post:post
                })
                // if(req.session.user){
                //     res.render('index', {
                //         title: 'post_show',
                //         post:post,
                //         currentUser:req.session.user.id,
                //     });
                // }
                // else{
                //     res.render('index', {
                //         title: 'post_show',
                //         post:post,
                //         currentUser:null,
                //     });
                // }
            })
        })
    ;

    return router;
}