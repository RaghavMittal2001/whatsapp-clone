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
    origin :process.env.Frontend_URL,
    credentials:true
}));
app.use(express.json());
app.use(cookieParser())
const port=process.env.PORT || 8000;


app.get('/', (req, res) => { 
    res.send('Hello, World!');
});

//api endpoints
app.use('/api',router);
server.listen(port, () => { 
    //console.log(`Server is running on http://localhost:${port}`);
}); 