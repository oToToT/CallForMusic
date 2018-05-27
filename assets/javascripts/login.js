/* globals grecaptcha */
function render_recaptcha() {
    grecaptcha.render('reCAPTCHA', {
        'sitekey': '6Lftm1sUAAAAAIdXCNYWPNDp3tIPYRkxhPsXkMAx',
        'callback': ()=>{
            $('#submit').removeAttr('disabled');
        },
        'expired-callback': ()=>{
            $('#submit').attr('disabled', 'disabled');
        }
    });
}