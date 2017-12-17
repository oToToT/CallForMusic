var game_status = {
    paused: true,
    prev_time: null,
    score: 0,
    notes: []
};
(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

function gamerender(time) {
    if (game_status.prev_time === null) game_status.prev_time = time;
    if (!game_status.paused) {
        for (var note of game_status.notes) {
            note.dataset.pos = Number(note.dataset.pos) + (time - game_status.prev_time) / 5;
            note.style.top = note.dataset.pos + "px";
        };
    }
    game_status.prev_time = time;
    requestAnimationFrame(gamerender);
}
requestAnimationFrame(gamerender);

$("#msg").on("shown.bs.modal", function(){
    if($(this).data("hidden")) $(this).modal("hide");
});
$("#msg").on("hidden.bs.modal", function(){
    if(!$(this).data("hidden")) $(this).modal("show");
});

var socket = io('/');
socket.on('connect', function() {
    $("#msg .modal-title").text('等待手機連線中');
    $("#msg .modal-body").html(
        `請用手機連至xxx.xx並登入以遊玩本遊戲
        <br>
        <img src="/images/loading.svg">
        <br>
        Loading Icon by <a href="https://loading.io/spinner/double-ring" target="_blank">loading.io</a>`
    );
    $("#msg").modal("show");
    $("#msg").data("hidden", false);
});
socket.on('devices', function(data) {
    if (data.computer && data.mobile) {
        $("#msg").data("hidden", true);
        game_status.paused = false;
    }
});
socket.on("note", function(data) {
    var newnote = document.createElement("div");
    newnote.setAttribute("class", "note");
    $("body").add(newnote);
    game_status.notes.push(newnote);
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
