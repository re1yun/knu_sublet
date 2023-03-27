//routes/post.js

module.exports = function(app){
    var express  = require('express');
    var router = express.Router();
    var Post = require('../models/post');
    var File = require('../models/file');
    var util = require('../util');
    const mongoose = require('mongoose');
    const path = require('path');
    const multer = require('multer');
    const stroage = multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, 'public/uploads/');
        },
        filename: function(req, file, cb){
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext);
            cb(null, basename + new Date().valueOf() + ext);
        }
    });

    const upload = multer({ 
        storage: stroage
    });

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
        .post(util.isLoggedin, upload.array('image'), async function(req, res){
            req.body.author = req.user._id;

            try {
                console.log("post creation start on post");
                const post = await Post.create(req.body);
                console.log("post creation success on post");

                // iterate through files and create new file instance
                for (var i = 0; i < req.files.length; i++) {
                    var file = req.files[i];
                    var newFilePromise = File.createNewInstance(file, req.user._id, post._id);
                    var newFileId = await newFilePromise;
                    post.attachment.push(newFileId);
                }
                
                console.log("post attachment success on post");
                await post.save();
        
                res.redirect('/post/' + post._id + res.locals.getPostQueryString());
            } catch(err) {
                // if post creation fails, return to new post page with error message
                console.log("post creation failed on post");
                console.log(err);
                req.flash('post', req.body);
                req.flash('errors', util.parseError(err));
                return res.redirect('/post/new' + res.locals.getPostQueryString());
            }

        })
    ;

    // image upload test route
    router.route('/upload')
        .get(function(req, res){
            res.render('index', {
                title: 'posts/post_upload_image_test'
            })
        })
        .post(upload.array('image'), function(req, res){
            if (req.files) {
                console.log('File uploaded successfully.');
            } else {
                console.log('Error uploading file:', req.files.error);
            }
            res.redirect('/');
        })
    ;
    
    router.route('/:id/edit')
        .get(util.isLoggedin, checkPermission, function(req, res){
            // post: incase if editing fails, we want to keep the data
            var post = req.flash('post')[0];
            var errors = req.flash('errors')[0] || {};
            console.log("recieved post edit get request");
            if(!post){
                //console.log('no post found');
                Post.findOne({_id: req.params.id})
                    .populate('attachment')
                    .exec(function(err, post){
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

        .put(util.isLoggedin, checkPermission, upload.array('image'), async function(req, res){
            console.log("recieved post edit put request");
            req.body.updatedAt = Date.now();
            
            // find post first
            const post = await Post.findOne({_id: req.params.id});
            if(req.files){
                console.log("additional files found");
                // iterate through files and create new file instance
                for (var i = 0; i < req.files.length; i++) {
                    var file = req.files[i];
                    var newFilePromise = File.createNewInstance(file, req.user._id, req.params._id);
                    var newFileId = await newFilePromise;
                    post.attachment.push(newFileId);
                }
            }

            // delete selected files
            if(req.body.deleteImage){
                for (let i = 0; i < req.body.deleteImage.length; i++) {
                    console.log("orig: " + post.attachment[i]._id);
                    console.log("checkbox: " + req.body.deleteImage[i]);
                    const fileId = req.body.deleteImage[i];
                    await File.updateOne({_id: fileId}, {isDeleted: true});
                }
            }

            // save post
            await post.save();
            
            // else post save success, redirect to post info page
            res.redirect('/post/' + req.params.id + res.locals.getPostQueryString());

            /* Post.findOneAndUpdate({_id: req.params.id}, req.body, {runValidators: true}, async function(err, post){
                // if post save fail, return back to edit page
                if(err){
                    req.flash('post', req.body);
                    req.flash('errors', util.parseError(err));
                    return res.redirect('/post/' + req.params.id + 'edit' + res.locals.getPostQueryString());
                }
                // else post save success, redirect to post info page
                res.redirect('/post/' + req.params.id + res.locals.getPostQueryString());
            }) */
        })
    ;

    router.route('/:id')
        .get(function(req, res){
            Post.findOne({_id:req.params.id})
                .populate('author')
                .populate('attachment')
                .exec(async function(err, post){
                    if(err) console.log(err);
                    post.views++;
                    await post.save();
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
    var Post = require('../models/post');
    Post.findOne({_id:req.params.id}, function(err, post){
        if(err) return res.json(err);
        // if no permission, perform noPermission in util.js
        if(post.author != req.user.id) return util.noPermission(req, res);
    
        next();
    });
}