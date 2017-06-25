var express = require('express');
var router = express.Router();
var passport = require('../config/passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express from Server' });

/* Get Login Page */

router.get('/login', function(req,res,next){
  res.render('login', { title: 'Login Page', message: req.flash('loginMessage') 
  });
});

/*POST login */

router.post('/login', passport.authenticate('local-login', {

    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash : true

}));

/* Get Signup Page */

router.get('/signup', function(req,res,next){
  res.render('signup', { title: 'Signup Page', message: req.flash('signupMessage')
  });
});

/* POST Signup */

router.post('/signup', passport.authenticate('local-signup', {

    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash: true

}));

/* Get Profile Page */

router.get('/profile', isLoggedIn, function(req,res,next){
  res.render('profile', { title: 'Profile Page', user: req.user
  });
});


/* Check whether the user is loggedIn */

function isLoggedIn(req, res, next){
  if(req.isAuthenticated())
    return next();
    res.redirect('/login');
}

/* GET LOGOUT Page */

router.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
});

});

module.exports = router;
