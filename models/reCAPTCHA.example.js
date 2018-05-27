const reCAPTCHA = require('recaptcha2');

const recaptcha = new reCAPTCHA({
    siteKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    secretKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
});

function isValid(req, res, next) {
    recaptcha.validateRequest(req)
        .then(function() {
            next();
        }).catch(function() {
            req.flash('error', 'reCAPTCHA驗證錯誤');
            res.redirect('./');
        });
}

module.exports = isValid;
