var express = require('express');
var passport = require('passport');
var Account = require('../models/account'); 
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(typeof req.user === "undefined")
	res.render('index', {
	    title: 'Call For Music - A New Style Music Game',
	    css: ['/stylesheets/index.css']
	});
    else
    	res.redirect('/play');
});

router.get('/play', function(req, res) {
    res.render('gameplay', { username: req.user.username });
});
router.get('/test', function(req, res) {
    res.render('socket', {} );
});

module.exports = router;
