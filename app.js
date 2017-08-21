var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('req-flash');
var helmet = require('helmet');
var passport = require('passport');
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var socketIO = require('socket.io');
var passportSocketIo = require('passport.socketio');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// midllewares that preprocess things
app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
var sessionStore = new session.MemoryStore();
app.use(session({
    secret: 'LQcbfu1wfJAgKLFZNG4X',
    store: sessionStore,
    resave: false, 
    saveUninitialized: false, 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'assets')));

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// Make socket.io able to use passport
var io = socketIO();
io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    secret: 'LQcbfu1wfJAgKLFZNG4X',
    store: sessionStore
}));
app.io = io;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
