import { Server as httpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { Message } from "../models/message_model";


interface User {
  userId: string;
  role: string;
}


export function configureSocket(expressServer: httpServer) {

  const io = new SocketIOServer(expressServer, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
  });

  const rooms: Record<string, User[]> = {};
  const broadcasters: Record<string, string> = {}; // Store broadcaster socket IDs by room

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    // Join a room
    socket.on('joinRoom', (roomId: string) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    // Handle sendMessage
    socket.on('sendMessage', async (data: { senderId: string, receiverId: string, message: string }) => {
      const { senderId, receiverId, message } = data;
      const newMessage = new Message({ senderId, receiverId, message });
      console.log('message recived: ', newMessage)
      await newMessage.save();

      // Emit message to the room
      const roomId = getRoomId(senderId, receiverId);
      socket.broadcast.to(roomId).emit('receiveMessage', newMessage);
      // io.to(roomId).emit('receiveMessage', newMessage);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
      for (const room in rooms) {
        rooms[room] = rooms[room].filter((user) => user.userId !== socket.id);
        if (rooms[room].length === 0) {
          delete rooms[room];
          delete broadcasters[room];
        } else if (broadcasters[room] === socket.id) {
          delete broadcasters[room];
        }
      }
    });
  });


}

function getRoomId(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join('_');
}