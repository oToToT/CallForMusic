const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = require('bluebird');
const MonConn = mongoose.createConnection('mongodb://127.0.0.1:27017/CallForMusic');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    username: String,
    introduction: String,
    icon: String
});

// For more setting, visit https://github.com/saintedlama/passport-local-mongoose#options
AccountSchema.plugin(passportLocalMongoose, {
    errorMessages: {
        UserExistsError: '此帳號已被使用',
        IncorrectPasswordError: '帳號或密碼錯誤',
        IncorrectUsernameError: '帳號或密碼錯誤',
        MissingUsernameError: '請輸入帳號',
        MissingPasswordError: '請輸入密碼',
        AttemptTooSoonError: '帳號目前無法登入，請稍後再試',
        TooManyAttemptError: '帳號目前無法登入，請勿大量嘗試各式密碼'
    }
});
var User = MonConn.model('account', AccountSchema);

module.exports = User;