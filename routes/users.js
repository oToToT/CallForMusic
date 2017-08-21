var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
const Root = 'users';

router.get('/', function(req, res){
    res.render(Root+'/index', { user: req.user });
});
router.get('/register', function(req, res){
    res.render(Root+'/register', {
	title: '註冊 Call For Music',
	css: ['/stylesheets/bootstrap.min.css'],
	errMsg: req.flash().error
    });
});
router.get('/login', function(req, res){
    res.render(Root+'/login', {
	title: '登入 Call For Music',
	css: ['/stylesheets/bootstrap.min.css'],
    	errMsg: req.flash().error
    });
});
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('./');
});

router.post('/register', function(req, res){
    Account.register(new Account({username: req.body.username}), 
		    req.body.password, 
		    function(err, account){
	if(err){
	    req.flash('error', err.message);
	    return res.redirect('/users/register');
	}
	passport.authenticate('local')(req, res, function() {
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
