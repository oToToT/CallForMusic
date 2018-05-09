var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var MobileDetect = require('mobile-detect');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (typeof req.user === 'undefined') {
        res.render('index', {
            title: 'Call For Music - A New Style Music Game',
            css: ['/stylesheets/index.css']
        });
    } else {
        res.redirect('game');
    }
});

router.get('/game', function(req, res) {
    if (typeof req.user === 'undefined') {
        res.redirect('/');
    } else {
        var md = new MobileDetect(req.headers['user-agent']);
        if (md.mobile()) {
            res.redirect('/game/control');
        } else {
            res.redirect('/game/play');
        }
    }
});

router.get('/game/play', function(req, res) {
    // req.pid for song select
    if (typeof req.user === 'undefined') {
        res.redirect('/');
    } else {
        res.render('game/play', {
            title: 'Call For Music - Let\'s Rock!',
            css: ['/stylesheets/bootstrap.min.css',
                '/stylesheets/game/play.css'
            ],
            username: req.user.username,
            video_id: '1SOug6QU7OI'
        });
    }
});

router.get('/game/control', function(req, res) {
    // req.pid for song select
    if (typeof req.user === 'undefined') {
        res.redirect('/');
    } else {
        res.render('game/control', {
            title: 'Call For Music - Shake it!',
            css: ['/stylesheets/bootstrap.min.css'],
            username: req.user.username
        });
    }
});

module.exports = router;