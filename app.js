var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');

var index = require('./server/routes/index');
var users = require('./server/routes/users');

// ODM with mongoose

var mongoose = require('mongoose');

// Modules to store session

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// Passport and Warning Flash modules

var passport = require('passport');
var flash = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, './server/views/pages'));
app.set('view engine', 'ejs');

//Database configuration

var config = require('./server/config/config');

//connect to database

mongoose.connect(config.url);

mongoose.connection.on('error', function(){
  console.error('MongoDB connection error. Check if mongodb is running');
});

//Require passport configuration

require('./server/config/passport')(passport);


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
// secret for session
app.use(session({
    secret: 'sometextgohere',
    saveUninitialized: true,
    resave: true,
    //store session on MongoDB using express-session + connect mongo
    store: new MongoStore({
        url: config.url,
        collection : 'sessions'
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', index);
//app.use('/users', users);

module.exports = app;

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + server.address().port);
});
