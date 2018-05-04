$("#msg").on("shown.bs.modal", function() {
    if ($(this).data("hidden")) $(this).modal("hide");
});
$("#msg").on("hidden.bs.modal", function() {
    if (!$(this).data("hidden")) $(this).modal("show");
});

(function() {
    var game_status = {
        paused: false
    };
    var socket = io('/');
    if (window.DeviceMotionEvent) {
        const threshold = 20;
        var pre_x, pre_y, pre_z, pre_t = Date.now();
        window.addEventListener('devicemotion', function(e) {
            var data = e.accelerationIncludingGravity;
            if (Math.abs(data.x - pre_x) > threshold || Math.abs(data.y - pre_y) > threshold || Math.abs(data.z - pre_z) > threshold) {
                var t = Date.now();
                if (t - pre_t > 100) socket.emit("beat", { time: t });
                pre_t = t;
            }
            pre_x = data.x;
            pre_y = data.y;
            pre_z = data.z;
        }, false);
    } else {
        alert("Not Supported Browser");
    }
    socket.on('connect', function() {
        $("#msg .modal-title").text('等待手機連線中');
        $("#msg .modal-body").html(
            `請用電腦連至xxxx.xx並登入以遊玩本遊戲
            <br>
            <img src="/images/loading.svg">
            <br>
            Loading Icon by <a href="https://loading.io/spinner/double-ring" target="_blank">loading.io</a>`
        );
        $("#msg").data("hidden", false);
        $("#msg").modal({
            backdrop: "static",
            keyboard: false
        });
        game_status.paused = true;
    });
    socket.on('devices', function(data) {
        if (data.computer && data.mobile) {
            $("#msg").data("hidden", true);
            $("#msg").modal("hide");
            game_status.paused = false;
        } else {
            $("#msg").data("hidden", false);
            $("#msg").modal("show");
            game_status.paused = true;
        }
    });
    socket.on('connect_error', function(err) {

    });
    socket.on('error', function(error) {
        if (error === 'Passport was not initialized' || error === 'User not authorized through passport. (User Property not found)') {
            location.href = '/users/login';
        } else {
            console.log(error);
        }
    });
})();