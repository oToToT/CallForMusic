var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
const Root = 'users';

router.get('/', function(req, res){
    res.render(Root+'/index', { user: req.user });
});
router.get('/register', function(req, res){
    res.render(Root+'/register', {});
});
router.get('/login', function(req, res){
    res.render(Root+'/login', {});
});
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('./');
});

router.post('/register', function(req, res){
    Account.register(new Account({ username : req.body.username}), 
		    req.body.password, 
		    function(err, account){
	if(err){
	    return res.render(Root+'/register', { account: account });
	}
	passport.authenticate('local')(req, res, function() {
	    res.redirect('./');
	});
    });
});
router.post('/login', passport.authenticate('local'), function(req, res){
    res.redirect('./');
});

module.exports = router;
