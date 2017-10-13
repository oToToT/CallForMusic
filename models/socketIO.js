var MobileDetect = require('mobile-detect');

function IOHandler(io) {
    io.on('connection', function(socket) {
        var md = new MobileDetect(socket.request.headers['user-agent']);
        socket.join(socket.request.user.username, function() {
            if (md.mobile()) {
                io.to(socket.request.user.username).emit("join", 1);
            } else {
                io.to(socket.request.user.username).emit("join", 2);
            }
        });
    });
}

module.exports = IOHandler;