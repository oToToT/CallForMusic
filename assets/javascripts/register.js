/* globals swal */
$('#imgUpload').click(() => {
    $('#icon').click();
});
$('#icon').change(function(e) {
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
$('#cropImage').on('shown.bs.modal', ()=>{
    $('#hiddenIcon').cropper({
        viewMode: 2,
        aspectRatio: 1,
        zoomable: false,
        scalable: false,
        rotatable: false,
        movable: false
    });
}).on('hidden.bs.modal', ()=>{
    $('#hiddenIcon').cropper('destroy');
});
$('#cropIt').click(()=>{
    $('#hiddenIcon').cropper('getCroppedCanvas').toBlob((b)=>{
        const url = URL.createObjectURL(b);
        $('#imgUpload').data('url', url);
        $('#imgUpload').css('background-image', 'url(\''+url+'\')');
    });
    $('#cropImage').modal('hide');
});
$('#imgUpload').hover(function(){
    $(this).css('background-image', 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)),url(\''+$(this).data('url')+'\')');
},function(){
    $(this).css('background-image', 'url(\''+$(this).data('url')+'\')');
});