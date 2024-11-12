import mongoose, { Schema } from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true, 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase:true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_pic: {
        type: String || URL,
        required: true,
      },
  },{
    timestamps:true
  });
  
 
  const User = mongoose.model("User", userSchema);
  
  export default User;
 