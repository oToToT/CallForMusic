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
function resizeReCaptcha() {
    const width = $('#reCAPTCHA').parent().width();
    const scale = Math.min(width / 302, 1);
    $('#reCAPTCHA').css('transform', 'scale(' + scale + ')');
    $('#reCAPTCHA').css('-webkit-transform', 'scale(' + scale + ')');
    $('#reCAPTCHA').css('transform-origin', '0 0');
    $('#reCAPTCHA').css('-webkit-transform-origin', '0 0');
}
resizeReCaptcha();
$(window).on('resize', resizeReCaptcha);