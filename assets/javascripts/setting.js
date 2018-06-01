/* globals swal */
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
$('#imgUpload').css('background-image', 'url(\'' + $('#imgUpload').data('url') + '\')');

$('form#editForm').submit(async function (e) {
    e.preventDefault();
    if ($('#checkPassword').val() != $('#password').val()) {
        $('#errMsg').text('請確認密碼輸入相同');
        $('#errDialog').show();
        return;
    }

    const { value: password } = await swal({
        title: '請輸入密碼',
        input: 'password',
        inputPlaceholder: '請輸入登入時的密碼',
        inputAttributes: {
            'autocapitalize': 'off',
            'autocorrect': 'off'
        },
        inputValidator: async(value) => {
            let {done: ok, error: msg} = await $.ajax({
                type: 'POST',
                url: '/checkPassword',
                data: {password: value},
                dataType: 'json'
            });
            if(msg === '帳號或密碼錯誤') msg = '密碼錯誤';
            return !ok && msg;
        }
    });
    swal('上傳資料中...');
    let formData = new FormData(this);
    formData.set('originalPassword', password);
    if(formData.get('password') === '') formData.set('password', password);
    $.ajax({
        url: $('#imgUpload').data('url'),
        type: 'GET',
        dataType: 'blob',
        success: function (data) {
            formData.set('icon', data);
            $('#errDialog').hide();
            $('#successDialog').hide();
            $.ajax({
                url: '/edit',
                type: 'POST',
                data: formData,
                dataType: 'json',
                success: function (dta) {
                    swal.close();
                    if(dta.done) {
                        $('#successMsg').text('成功修改');
                        $('#successDialog').show();
                        $('#password').val('');
                        $('#checkPassword').val('');
                    } else {
                        if(dta.error === '帳號或密碼錯誤') dta.error = '密碼錯誤!';
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