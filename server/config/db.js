import dotenv from "dotenv";
import mongoose from "mongoose";
// dotenv.config();
const connectDB = async() =>{
  console.log(process.env.MongoURI);
  mongoose.connection.once("open",()=>{
    console.log("hiii"); 
    
  })
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to db");
  });
  mongoose.connection.on("error", (err) => {    
    console.log("Mongoose connection error: ", err);
  });
  await mongoose.connect(process.env.MongoURI);
    
    
    console.log("Connected to MongoDB");
    const connected=mongoose.connection;
  
}
 



  
  export default connectDB;
  