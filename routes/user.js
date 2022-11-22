//routes/user.js

const { json } = require("body-parser");

module.exports = function(app){
    var express = require("express");
    var router = express.Router();
    var User = require("../models/user");
    var passport = require("../config/passport");
    var util = require("../util");

    router.route('/')
    ;
    
    router.route('/sign_in')
        .get(function(req, res){
            var user = req.flash('user')[0] || {};
            var errors = req.flash('errors')[0] || {};
            console.log(req.flash);
            res.render('index', {
                title: 'users/sign_in',
                user: user,
                errors: errors
            })
        })
        .post(function(req, res, next){
            var errors = {};
            var isValid = true;

            console.log(req.body);

            if(!req.body.userID){
                isValid = false;
                errors.userID = 'UserID is required!';
            }
            if(!req.body.password){
                isValid = false;
                errors.password = 'Password is required!';
            }
            console.log(isValid);
            
            if(isValid){
                next();
            }
            else{
                req.flash('errors',errors);
                res.redirect('/user/sign_in');
            }
        },
            passport.authenticate('local-login', {
                successRedirect : '/',
                failureRedirect : '/user/sign_in',
                failureFlash: true
            })
        )
    ;

    //go to sign up page
    router.route('/sign_up')
        .get(function(req, res){
            var user = req.flash('user')[0] || {};
            var errors = req.flash('errors')[0] || {};
            res.render('index', {
                title: 'users/sign_up',
                user: user,
                errors: errors
            })
        })
        .post(function(req, res){
            User.create(req.body, function(err, user){
                if(err) {
                    req.flash('user', req.body);
                    req.flash('errors', util.parseError(err));
                    res.redirect('/user/sign_up')
                }
                else{
                    res.redirect('/user/'+ user.userID);
                }
            })
        })
    ;   
        
    //logout the user
    router.route('/sign_out')
        .get(function(req, res){
            req.logout(function(err){
                if(err) return res.json(err);
                res.redirect('/');
            });
        })
    ;

    //browse user info
    router.route('/:userID')
        .get(util.isLoggedin, function(req, res){
            User.findOne({userID:req.params.userID}, function(err, user){
                if(err) return res.json(err);
                res.render('index', {
                    title: 'users/user_info',
                    user:user
                })
            })
        })
    ;
    
    return router;
}