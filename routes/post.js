//routes/post.js

module.exports = function(app){
    var express  = require('express');
    var router = express.Router();
    var Post = require('../models/post');
    var util = require('../util');

    router.route('/new')
        .get(util.isLoggedin, function(req, res){
            var post = req.flash('post')[0] || {};
            var errors = req.flash('errors')[0] || {};
            res.render('index', {
                title: 'posts/post_new',
                post: post,
                errors: errors
            })
        })
        .post(util.isLoggedin, function(req, res){
            req.body.author = req.user._id;
            Post.create(req.body, function(err, post){
                console.log(req.body);
                console.log(err);
                if(err) {
                    console.log("post creation failed on post");
                    req.flash('post', req.body);
                    req.flash('errors', util.parseError(err));
                    return res.redirect('/post/new')
                }
                res.redirect('/post/' + post._id);
            });
        })
    ;
    
    router.route('/:id/edit')
        .get(util.isLoggedin, checkPermission, function(req, res){
            var post = req.flash('post')[0];
            var errors = req.flash('errors')[0] || {};
            console.log("recieved post edit get request");
            if(!post){
                console.log('no post found');
                Post.findOne({_id: req.params.id}, function(err, post){
                    if(err){
                        return res.return(err);
                    }
                    res.render('index', {
                        title: 'posts/post_edit',
                        post: post,
                        errors: errors
                    })
                })
            }
            else{
                post._id = req.params.id;
                res.render('index', {
                    title: 'posts/post_edit',
                    post: post,
                    errors: errors
                })
            }
        })

        .put(util.isLoggedin, checkPermission, function(req, res){
            req.body.updatedAt = Date.now();
            Post.findOneAndUpdate({_id: req.params.id}, req.body, {runValidators: true}, function(err, post){
                if(err){
                    req.flash('post', req.body);
                    req.flash('errors', util.parseError(err));
                    return res.redirect('/post/' + req.params.id + 'edit');
                }
                res.redirect('/post/' + req.params.id);
            })
        })
    ;

    router.route('/:id')
        .get(function(req, res){
            Post.findOne({_id:req.params.id})
                .populate('author')
                .exec(function(err, post){
                    if(err) console.log(err);
                    res.render('index', {
                        title: 'posts/post_info',
                        post: post
                    })
                })
            })
    ;

    return router;
}

function checkPermission(req, res, next){
    Post.findOne({_id:req.params.id}, function(err, post){
        if(err) return res.json(err);
        if(post.author != req.user.id) return util.noPermission(req, res);
    
        next();
    });
}