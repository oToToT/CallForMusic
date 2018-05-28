const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('req-flash');
const helmet = require('helmet');
const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const socketIO = require('socket.io');
const passportSocketIo = require('passport.socketio');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// midllewares that preprocess things
app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json({ limit:'50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit:'50mb' }));
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
app.use('/profile_images', express.static(path.join(__dirname, 'uploads')));

app.use('/', require('./routes/index'));
app.use('/game', require('./routes/game'));

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
    store: sessionStore,
    passport: passport,
    success: function(data, accept) {
        accept();
    },
    fail: function(data, message, error, accept) {
        return accept(new Error(message));
    }
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