var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (typeof req.user === "undefined") {
        res.render('index', {
            title: 'Call For Music - A New Style Music Game',
            css: ['/stylesheets/index.css']
        });
    } else {
        res.redirect('game/display');
    }
});

router.get('/game/display', function(req, res) {
    if (typeof req.user === "undefined") {
        res.redirect('/');
    } else {
        res.render('game/display', {
            title: 'Call For Music - Let\'s Rock!',
            css: ['/stylesheets/bootstrap.min.css'],
            username: req.user.username
        });
    }
});


module.exports = router;