/* globals SHA256 */
(() => {
    function process_file(files) {
        let read_for_hash = new FileReader();
        read_for_hash.onload = async(e) => {
            const hash = await SHA256.sha256Buffer(e.target.result);
            console.log(hash);
            // fetch ranking by hash using ajax
        };
        if (files.length != 1) {
            console.log('failed to read');
        } else {
            $('#choose_file').hide();
            $('#upload_file').off('dragleave dragend dragover drop');
            $('#loading').show();
            read_for_hash.readAsArrayBuffer(files[0]);
        }
    }
    $('#upload_mask').on('dragleave dragend', (e) => {
        e.stopPropagation();
        e.preventDefault();
        $('#upload_mask').hide();
    });
    $('#upload_file').on('dragover', (e) => {
        e.stopPropagation();
        e.preventDefault();
        $('#upload_mask').show();
    });
    $('#upload_file').on('drop', (e) => {
        e.stopPropagation();
        e.preventDefault();
        process_file(e.originalEvent.dataTransfer.files);
        $('#upload_mask').hide();
    });
    $('#choose_file').click((e) => {
        e.preventDefault();
        $('#file_uploader').click();
    });
    $('#file_uploader').change(() => {
        process_file($('#file_uploader').get(0).files);
    });
})();