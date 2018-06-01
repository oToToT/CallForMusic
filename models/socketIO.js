var MobileDetect = require('mobile-detect');
var roomdata = {};
const fs = require('fs');
const write_stream = fs.createWriteStream('music_data');

function IOHandler(io) {
    io.on('connection', (socket) => {
        console.log('hi!!');
        const roomname = socket.request.user.username;
        let md = new MobileDetect(socket.request.headers['user-agent']);
        if (typeof roomdata[roomname] === 'undefined') roomdata[roomname] = {};
        socket.join(roomname, () => {
            let devices = roomdata[roomname].devices;
            if (typeof devices === 'undefined') {
                devices = { mobile: false, computer: false };
            }
            if (md.mobile()) {
                devices.mobile = true;
            } else {
                devices.computer = true;
            }
            io.to(roomname).emit('devices', devices);
            roomdata[roomname].devices = devices;
        });
        socket.on('beat', (data) => {
            io.to(roomname).emit('beat');
            console.log('Hit!', data);
        });
        socket.on('disconnect', () => {
            var devices = roomdata[roomname].devices;
            if (md.mobile()) devices.mobile = false;
            else devices.computer = false;
            io.to(roomname).emit('devices', devices);
            roomdata[roomname].devices = devices;
        });
        socket.on('data', (data) => {
            write_stream.write(data.tf ? '1' : '0');
            for (let i = 0; i < 512; i++) {
                write_stream.write(` ${i+1}:${data.arr[i]}`);
            }
            write_stream.write('\n');
        });
    });
}

module.exports = IOHandler;