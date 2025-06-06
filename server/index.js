import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import router from './routes/main.js'
import cookieParser from "cookie-parser";
import { app,server } from "./socket/index.js";

dotenv.config();

// const app =express();
connectDB();
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5174",
            "https://whatsapp-clone-bay-three.vercel.app",
            "https://whatsapp-clone-6w1i.onrender.com/",
            
        ]; 
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser())
const port=process.env.PORT || 9000;


app.get('/', (req, res) => { 
    res.header('Access-Control-Allow-Origin', 'http://localhost:5174');

    // res.header('Access-Control-Allow-Origin', 'https://whatsapp-clone-bay-three.vercel.app');
    res.send('Hello, World!');
}); 

//api endpoints
app.use('/api',router); 
server.listen(port, () => { 
    console.log(`Server is running on http://localhost:${port}`);
});