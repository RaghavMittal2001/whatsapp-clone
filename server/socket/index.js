import express from "express";
import { Server } from "socket.io";
import http from "http";
import Getuserdetailfromtoken from "../Helper/Getuserdetailfromtoken.js";
import User from "../model/User.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.Frontend_URL || "http://localhost:5173", 
        credentials: true,
    },
});
const onlineuser = new Set();
io.on("connection", async (socket) => {
    console.log("connect user ", socket.id);

    const token = socket.handshake.auth.token;
    // console.log(token);
    try {
        const user = await Getuserdetailfromtoken(token);
        // console.log('User connected:', user);
        socket.join(user._id);
        onlineuser.add(user._id.toString());
        io.emit("onlineuser", Array.from(onlineuser));
        socket.on('message_page',async(userId)=>{
            console.log('userId',userId);
            const userdetails =await User.findById(userId).select("-password");
            console.log(userdetails);
            
            const payload={
                _id :userdetails._id,
                name :userdetails.name,
                email:userdetails.email,
                profile_pic:userdetails.profile_pic,
                online:onlineuser.has(userId)
            }
            socket.emit('message_user',payload )
        })
        //disconnection
        socket.on("disconnect", () => {
            onlineuser.delete(user._id)
            console.log("disconnect user ", socket.id);
        });
    } catch (err) {
        console.error(err.message);
        socket.emit("error", { message: err.message }); // Notify the client
        socket.disconnect(); // Disconnect the client 
    }


});
export { app, server };
