const handleSocket = (io) => {
  const clients = {};
  let adminSocketid = null;
  io.on("connection", (socket) => {
    console.log(socket.id, "connect");
    socket.on("registerClient", ({ clientId, name, email }) => {
      console.log(`${name} is connect with email ${email}`)
      clients[clientId] = {SocketId: socket.id, name, email};
      if (adminSocketid) {
         io.to(adminSocketid).emit('clientsList', clients)
       }
    });
    socket.on("adminRegister", () => {
      adminSocketid = socket.id;
      socket.emit('clientsList', clients)
    });
    socket.on("send", (data) => {
      console.log(data,'client message')
      if (adminSocketid) {
        io.to(adminSocketid).emit("clientmsgrecieve", {
          name: clients[data.sender]?.name,
          sender: data.sender,
          message: data.message,
          senderType: "client",
          time: new Date().toISOString(),
        });
      }
    });
    socket.on("adminReply", ({ clientId, message }) => {
      const clientSocketid = clients[clientId]?.SocketId;
      if (clientSocketid) {
        io.to(clientSocketid).emit("adminmsgrecieve", {
          from: "admin",
          message: message,
          senderType: "admin",
          timestamp: new Date().toISOString(),
        });
      }
    });
    socket.on("joinRoom", ({ room, clientId, name, email, admin }) => {
      socket.join(room);
    
      if (admin) {
        console.log("Admin joined room:", room);
      } else {
        clients[clientId] = { socketId: socket.id, name, email, room };
        console.log(`${name} (${clientId}) joined room ${room}`);
      }
      socket.to(room).emit('joinmsg', { message: `${name} has joined the room`,clientId: clientId, name, time: new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})})
      socket.emit('joinmsg', {message: 'Welcome to the room!', clientId: clientId, name, time: new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})})
      
      
    });
    socket.on('sendRoomMsg', (data) => {
      const { message, time, clientId, room, name } = data;
      console.log(data,'data')
      socket.to(room).emit('recieveRoomMsg', {
        message,
        time,
        name,
        clientId,
      });
    });
    // socket.on("adminGroupMessage", ({ room, message }) => {
    //   socket.to(room).emit("recieve", {
    //     from: "admin",
    //     message,
    //     senderType: "admin",
    //     timestamp: new Date().toISOString(),
    //   });
    // });
    socket.on("disconnect", () => {
        console.log("disconnect", socket.id);
        if (socket.id === adminSocketid) {
            adminSocketid = null
        }
        for (const [clientId, id] of Object.entries(clients)) {
            if (socket.id === id) {
                delete clients[clientId]
                break;
            }
      }
      if (adminSocketid) {
        io.to(adminSocketid).emit("clientsList", clients);
      }
    });
    socket.on("reconnect_attempt", (attempt) => {
      console.log(`🔄 Reconnection attempt ${attempt}`);
    });
    
    socket.on("reconnect", (attempt) => {
      console.log(`✅ Reconnected successfully after ${attempt} attempts`);
    });
    
    socket.on("reconnect_error", (error) => {
      console.log("⚠️ Reconnect error:", error);
    });
    
    socket.on("reconnect_failed", () => {
      console.log("🚫 Reconnect failed. No more attempts.");
    });
  });
};

module.exports = handleSocket;
