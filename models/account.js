var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = require('bluebird');
var MonConn = mongoose.createConnection('mongodb://127.0.0.1:27017/MusicGameAccount');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
    username: String,
    password: String
});

AccountSchema.plugin(passportLocalMongoose);
var User = MonConn.model('Account', AccountSchema);

module.exports = User;
