const socketManager = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);
        });

        socket.on('leaveRoom', (roomId) => {
            socket.leave(roomId);
            console.log(`Socket ${socket.id} left room ${roomId}`);
        });

        // Chat
        socket.on('sendMessage', (data) => {
            io.to(data.roomId).emit('messageReceived', data);
        });

        // Collaboration
        socket.on('documentChange', (data) => {
            // Emits only to others in the room
            socket.to(data.roomId).emit('documentUpdated', data);
        });
        
        socket.on('cursorMove', (data) => {
            socket.to(data.roomId).emit('cursorUpdated', data);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

module.exports = socketManager;
