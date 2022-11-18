// config/passport.js

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; // 1
var User = require('../models/user');

// serialize & deserialize User // 2
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({_id:id}, function(err, user) {
        done(err, user);
    });
});
  
passport.use('local-login',
    new LocalStrategy({
        usernameField : 'userID',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, userID, password, done) {
        User.findOne({userID:userID})
            .select({password:1})
            .exec(function(err, user) {
                if (err) return done(err);
                if (user && user.authenticate(password)){
                    return done(null, user);
                }
                else {
                    req.flash('userID', userID);
                    req.flash('errors', {login:'The userID or password is incorrect.'});
                    return done(null, false);
                }
            });
        }
    )
);
  
module.exports = passport;