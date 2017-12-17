var MobileDetect = require('mobile-detect');
var roomdata = {};

function IOHandler(io) {
    io.on('connection', function(socket) {
        var roomname = socket.request.user.username;
        var md = new MobileDetect(socket.request.headers['user-agent']);
        var devices = roomdata[roomname];
        socket.join(roomname, function() {
            if(typeof devices === 'undefined'){
                devices = {mobile: false, computer: false};
            }
            if (md.mobile()) {
                devices.mobile = true;
            } else {
                devices.computer = true;
            }
            io.to(roomname).emit("devices", devices);
            roomdata[roomname] = devices;
        });
        socket.on('disconnect', function(){
            if(md.mobile()) devices.mobile = false;
            else devices.computer = false;
            io.to(roomname).emit("devices", devices);
            roomdata[roomname] = devices;
        });
    });
}

module.exports = IOHandler;
