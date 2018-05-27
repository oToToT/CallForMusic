const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const MobileDetect = require('mobile-detect');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if (typeof req.user === 'undefined') {
        res.render('index', {
            title: 'Call For Music - A New Style Music Game',
            css: ['/stylesheets/index.css']
        });
    } else {
        res.redirect('game');
    }
});

router.get('/profile/:id', function (req, res) {

});

router.get('/setting', function (req, res) {
    if (typeof req.user !== 'undefined') {
        res.render('setting', {
            title: 'Call For Music',
            css: ['/stylesheets/bootstrap.min.css'],
            errMsg: req.flash().error,
            user: req.user
        });
    } else {
        res.redirect('/');
    }
});
router.get('/register', function (req, res) {
    res.render('register', {
        title: '註冊 | Call For Music',
        css: ['/stylesheets/bootstrap.min.css',
            '/stylesheets/register.css',
            '/stylesheets/sweetalert2.min.css',
            '/stylesheets/cropper.min.css'
        ],
        errMsg: req.flash().error
    });
});
router.get('/login', function (req, res) {
    res.render('login', {
        title: '登入 | Call For Music',
        css: ['/stylesheets/bootstrap.min.css'],
        errMsg: req.flash().error
    });
});
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('./');
});

router.post('/register', function (req, res) {
    Account.register(new Account({
        username: req.body.username,
        introduction: req.body.intro,
        icon: req.body.imagePath
    }),
    req.body.password,
    function (err) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/users/register');
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('./');
        });
    });
});
router.post('/login', passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/users/login',
    failureFlash: true
}));

module.exports = router;