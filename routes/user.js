//routes/user.js

module.exports = function(app){
    var express = require("express");
    var router = express.Router();
    var User = require("../models/user");

    //go to sign up page
    router.route('/sign_up')
        .get(function(req, res){
            res.render('index', {
                title: 'users/sign_up'
            })
        })
        
        .post(function(req, res){
            User.create(req.body, function(err, user){
                if(err) return res.json(err);
                res.redirect('/');
            })
        })
        
    //browse user info
    router.route('/:userID')
        .get(function(req, res){
            User.findOne({userID:req.params.userID}, function(err, user){
                if(err) return res.json(err);
                res.render('index', {
                    title: 'users/user_show',
                    user:user
                })
            })
        })
    ;
    
    return router;
}


