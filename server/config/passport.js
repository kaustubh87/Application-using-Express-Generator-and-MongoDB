var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

var User = require('../models/users');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    
    //using local strategy
    passport.use('local-login', new LocalStrategy({
        //change default username and password to email and password
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true

    }, function (req, email, password, done) {
        if (email)
            email = email.toLowerCase();
        process.nextTick(function () {

            //if user is not logged in
            if (!req.user) {
                User.findOne({ 'local.email': email }, function (err, user) {

                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'Email already taken'));
                    }
                    else {
                        var newUser = new User();
                        newUser.local.name = req.body.name;
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }

                });
            } else {
                return done(null, req.user);
            }
        });
    }));
};
