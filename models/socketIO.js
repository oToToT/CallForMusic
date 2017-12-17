var MobileDetect = require('mobile-detect');
var roomdata = {};

function IOHandler(io) {
    io.on('connection', function(socket) {
        var roomname = socket.request.user.username;
        var md = new MobileDetect(socket.request.headers['user-agent']);
        socket.join(roomname, function() {
            var devices = roomdata[roomname];
            if(typeof devices === 'undefined'){
                devices = {mobile: false, computer: false};
            }
            if (md.mobile()) {
                devices.mobile = true;
            } else {
                devices.computer = true;
            }
            io.to(socket.request.user.username).emit("devices", devices);
            roomdata[roomname] = devices;
        });
    });
}

module.exports = IOHandler;
