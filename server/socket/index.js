import express from "express";
import { Server } from "socket.io";
import http from "http";
import Getuserdetailfromtoken from "../Helper/Getuserdetailfromtoken.js";
import User from "../model/User.js";
import Conversation from "../model/Conversation.js";
import Message from "../model/Message.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.Frontend_URL || "http://localhost:5173",
    credentials: true,
  },
});

const onlineUsers = new Set();

io.on("connection", async (socket) => {
  console.log("User connected:", socket.id);

  const token = socket.handshake.auth.token;
  try {
    const user = await Getuserdetailfromtoken(token);
    const userId = user._id.toString();

    socket.join(userId);
    onlineUsers.add(userId);
    io.emit("onlineuser", Array.from(onlineUsers));

    console.log("User joined room:", userId);

    // Get user details of receiver requested from sender side
    socket.on("message_page", async (receiverId) => {
    //   console.log("Fetching user details for:", receiverId);
      const userDetails = await User.findById(receiverId).select("-password");

      if (!userDetails) {
        console.log("User not found:", receiverId);
        return;
      }

      const payload = {
        _id: userDetails._id,
        name: userDetails.name,
        email: userDetails.email,
        profile_pic: userDetails.profile_pic,
        online: onlineUsers.has(receiverId),
      };

      socket.emit("message_user", payload);
    });

    // New message from sender to receiver
    socket.on("new_message", async (data) => {
      console.log("New message received:", data);

      let messageConversation = await Conversation.findOne({
        $or: [
          { sender: data.sender, receiver: data.receiver },
          { sender: data.receiver, receiver: data.sender },
        ],
      });

      // If conversation does not exist, create a new one
      if (!messageConversation) {
        console.log("Conversation does not exist. Creating new one...");
        messageConversation = await new Conversation({
          sender: data.sender,
          receiver: data.receiver,
          messages: [],
        }).save();
      }

      // Create new message
      const newMessage = await Message.create({
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        msgby: data.sender,
      });

      // Update conversation with new message
      const updatedConversation = await Conversation.findByIdAndUpdate(
        messageConversation._id,
        { $push: { messages: newMessage._id } },
        { new: true } // Ensure updated document is returned
      ).populate("messages");

      console.log("Updated conversation:", updatedConversation);

      // Send message to both sender and receiver using correct room
      io.to(data.receiver).emit("all_message", { conversation: updatedConversation });
      io.to(data.sender).emit("all_message", { conversation: updatedConversation });
    });

    // User disconnects
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      onlineUsers.delete(userId);
      io.emit("onlineuser", Array.from(onlineUsers)); // Update online users
    });

  } catch (err) {
    console.error("Socket authentication error:", err.message);
    socket.emit("error", { message: err.message });
    socket.disconnect(); // Disconnect client on error
  }
});

export { app, server };
