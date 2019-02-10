const express = require('express');
const MobileDetect = require('mobile-detect');
const router = express.Router();
const Root = 'game';

router.get('/', function (req, res) {
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

router.get('/play', function (req, res) {
    // req.pid for song select
    if (typeof req.user === 'undefined') {
        res.redirect('/');
    } else {
        res.render(Root + '/play', {
            title: 'Call For Music - Let\'s Rock!',
            css: ['/stylesheets/bootstrap.min.css',
                '/stylesheets/game/play.css'
            ],
            username: req.user.username,
            video_id: '1SOug6QU7OI'
        });
    }
});

router.get('/control', function (req, res) {
    // req.pid for song select
    if (typeof req.user === 'undefined') {
        res.redirect('/');
    } else {
        res.render(Root + '/control', {
            title: 'Call For Music - Shake it!',
            css: ['/stylesheets/bootstrap.min.css'],
            username: req.user.username
        });
    }
});
router.get('/train', function (req, res) {
    res.render('game/train');
});

module.exports = router;