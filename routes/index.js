const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const reCAPTCHA = require('../models/reCAPTCHA');
const MobileDetect = require('mobile-detect');
const multer = require('multer');
const mimeTypes = require('mime-types');
const fs = require('fs');
const path = require('path');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if (typeof req.user === 'undefined') {
        res.render('index', {
            title: 'Call For Music - A New Style Music Game',
            css: ['/stylesheets/index.css'],
            link: [{url: '/register', text: 'Register'}, {url: '/login', text: 'Login'}]
        });
    } else {
        res.render('index', {
            title: 'Call For Music - A New Style Music Game',
            css: ['/stylesheets/index.css'],
            link: [{url: '/setting', text: 'Setting'}, {url: '/game', text: 'Play'}]
        });
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

const upload = multer({
    'storage': multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, path.resolve(__dirname, '..', 'uploads'));
        },
        filename: function (req, file, callback) {
            const name = Date.now().toString() + '.' + mimeTypes.extension(file.mimetype);
            req.body.icon = name;
            callback(null, name);
        }
    })
});


router.post('/register', upload.single('icon'), reCAPTCHA.json, function (req, res) {
    console.log(req.file);
    if (req.body.username === '') {
        fs.unlink(path.join(req.file.destination, req.file.filename));
        return res.json({
            'done': false,
            'error': '請輸入帳號'
        });
    }
    if (req.body.password === '') {
        fs.unlink(path.join(req.file.destination, req.file.filename));
        return res.json({
            'done': false,
            'error': '請輸入密碼'
        });
    }
    Account.register(new Account({
        username: req.body.username,
        introduction: req.body.intro,
        icon: path.join(req.file.destination, req.body.username+path.extname(req.file.filename))
    }),
    req.body.password,
    function (err) {
        if (err) {
            fs.unlink(path.join(req.file.destination, req.file.filename));
            return res.json({
                'done': false,
                'error': err.message
            });
        }
        passport.authenticate('local')(req, res, function () {
            fs.rename(path.join(req.file.destination, req.file.filename), path.join(req.file.destination, req.body.username+path.extname(req.file.filename)));
            return res.json({
                'done': true
            });
        });
    });
});
router.post('/login', reCAPTCHA.flash, passport.authenticate('local', {
    successRedirect: '/setting',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;