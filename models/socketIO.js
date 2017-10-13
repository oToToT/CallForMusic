function IOHandler(io) {
    io.on('connection', function(socket) {
        console.log("> connected with socketIO");
        console.log(String(socket.request.user.username) + "has logined with socket");
        socket.emit('hi', { message: "hi" });
    });
}

module.exports = IOHandler;