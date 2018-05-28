/* globals swal, grecaptcha */
$('#imgUpload').click(() => {
    $('#icon').click();
});
$('#icon').change(function (e) {
    if (e.originalEvent.target.files.length != 1) {
        swal('Error', 'Please Choose Exactly One Image', 'error');
        return;
    }
    const f = e.originalEvent.target.files[0];
    if (f.type.split('/')[0] != 'image') {
        swal('Error', 'File type not supported', 'error');
        return;
    }
    $('#hiddenIcon').attr('src', URL.createObjectURL(f));
    $(this).val('');
    $('#cropImage').modal('show');
});
$('#cropImage').on('shown.bs.modal', () => {
    $('#hiddenIcon').cropper({
        viewMode: 2,
        aspectRatio: 1,
        zoomable: false,
        scalable: false,
        rotatable: false,
        movable: false
    });
}).on('hidden.bs.modal', () => {
    $('#hiddenIcon').cropper('destroy');
});
$('#cropIt').click(() => {
    $('#hiddenIcon').cropper('getCroppedCanvas').toBlob((b) => {
        const url = URL.createObjectURL(b);
        $('#imgUpload').data('url', url);
        $('#imgUpload').css('background-image', 'url(\'' + url + '\')');
    });
    $('#cropImage').modal('hide');
});
$('#imgUpload').hover(function () {
    $(this).css('background-image', 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)),url(\'' + $(this).data('url') + '\')');
}, function () {
    $(this).css('background-image', 'url(\'' + $(this).data('url') + '\')');
});

function render_recaptcha() {
    grecaptcha.render('reCAPTCHA', {
        'sitekey': '6Lftm1sUAAAAAIdXCNYWPNDp3tIPYRkxhPsXkMAx',
        'callback': () => {
            $('#submit').removeAttr('disabled');
        },
        'expired-callback': () => {
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

$('form#regForm').submit(function (e) {
    e.preventDefault();
    if ($('#checkPassword').val() != $('#password').val()) {
        $('#errMsg').text('請確認密碼輸入相同');
        $('#errDialog').show();
        return;
    }
    swal('上傳圖片中...');
    let formData = new FormData(this);
    $.ajax({
        url: $('#imgUpload').data('url'),
        type: 'GET',
        dataType: 'blob',
        success: function (data) {
            formData.set('icon', data);
            $.ajax({
                url: '/register',
                type: 'POST',
                data: formData,
                dataType: 'json',
                success: function (dta) {
                    swal.close();
                    if (dta.done) {
                        location.href = '/';
                    } else {
                        grecaptcha.reset();
                        $('#errMsg').text(dta.error);
                        $('#errDialog').show();
                    }
                },
                cache: false,
                contentType: false,
                processData: false
            });
        }
    });
});