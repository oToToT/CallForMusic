var MobileDetect = require('mobile-detect');
var roomdata = {};

function IOHandler(io) {
    io.on('connection', function(socket) {
        var roomname = socket.request.user.username;
        var md = new MobileDetect(socket.request.headers['user-agent']);
        if (typeof roomdata[roomname] === 'undefined') roomdata[roomname] = {};
        socket.join(roomname, function() {
            var devices = roomdata[roomname].devices;
            if (typeof devices === 'undefined') {
                devices = { mobile: false, computer: false };
            }
            if (md.mobile()) {
                devices.mobile = true;
            } else {
                devices.computer = true;
            }
            io.to(roomname).emit("devices", devices);
            roomdata[roomname].devices = devices;
        });
        socket.on('beat', function(data) {
            io.to(roomname).emit('beat');
            // console.log("Hit!", data);
        });
        socket.on('disconnect', function() {
            var devices = roomdata[roomname].devices;
            if (md.mobile()) devices.mobile = false;
            else devices.computer = false;
            io.to(roomname).emit("devices", devices);
            roomdata[roomname].devices = devices;
        });
    });
}

module.exports = IOHandler;