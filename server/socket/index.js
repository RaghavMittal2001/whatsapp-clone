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
  let userId;

  try {
    const user = await Getuserdetailfromtoken(token);
    userId = user._id.toString();

    socket.join(userId);
    onlineUsers.add(userId);
    io.emit("onlineuser", Array.from(onlineUsers));

    console.log("User joined room:", userId);

    // Clean up old event listeners before adding new ones
    socket.removeAllListeners("message_page");
    socket.removeAllListeners("new_message");
    socket.removeAllListeners("get_conversation");
    socket.removeAllListeners("get_user");
    socket.removeAllListeners("Get_last_message");

    // Get user details and conversation of receiver requested from sender
    socket.on("message_page", async (receiverId) => {
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

      // Get previous conversation
      const conversation = await Conversation.findOne({
        $or: [
          { sender: userId, receiver: receiverId },
          { sender: receiverId, receiver: userId },
        ],
      }).populate("messages");

      socket.emit("all_message", { conversation });
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
        console.log("Creating new conversation...");
        messageConversation = await new Conversation({
          sender: data.sender,
          receiver: data.receiver,
          messages: [],
        }).save();
      }

      // Create and save new message
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
        { new: true }
      ).populate("messages");
      console.log("Updated conversation:", updatedConversation);
      // Emit updated conversation to both sender and receiver
      io.to(data.receiver).emit("all_message", { conversation: updatedConversation });
      io.to(data.sender).emit("all_message", { conversation: updatedConversation });
    });

    // Fetch all previous conversations of the logged-in user
    socket.on("get_conversation", async (data) => {
      const current_conversations = await Conversation.find({
        $or: [{ sender: data }, { receiver: data}],
      }).populate("messages");
      const conversations = current_conversations.map((conversation) => {
        const countUnseenMsg = conversation.messages.reduce((prev, curr) => prev + (curr.seen ? 0 : 1), 0);
        return {
          _id: conversation._id,
          receiver: conversation.receiver,
          sender: conversation.sender,
          unseenMsg: countUnseenMsg,
          lastMsg: conversation.messages[conversation.messages.length - 1],
        };
      });
      socket.emit("all_conversations", conversations);
    });
 
    // Get user details of receiver
    socket.on("get_user", async (receiverId) => {
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

      socket.emit("user_details", payload);
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      if (userId) {
        onlineUsers.delete(userId);
        io.emit("onlineuser", Array.from(onlineUsers));
      }
    });
  } catch (err) {
    console.error("Socket authentication error:", err.message);
    socket.emit("error", { message: err.message });
    socket.disconnect();
  }
});   

export { app, server };
