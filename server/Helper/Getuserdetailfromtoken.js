import jwt from "jsonwebtoken"
import User from "../model/User.js";


const Getuserdetailfromtoken=async(token)=> {
  if(!token){
    return {
        message:"session out",
        logout:true 
    }
  } 
  try {
    // const user = jwt.verify(token, process.env.JWT_SECRET);
    const decode =jwt.verify(token,process.env.Jwt_Secret_Key);
    const user= await User.findOne({_id:decode.id}).select("-password");
    //   console.log(user);
    
    if (!user) {
      return {
        message: "User not found. Please log in again.",
        logout: true,
      };
    }
    return user ;
    
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.error('JWT expired:', err.expiredAt);
      return {
        message: "Token has expired. Please log in again.",
        logout: true,
      };
    }
    console.error("Invalid token:", err.message);
    return {
      message: "Invalid token. Please log in again.",
      logout: true,
    };
  }
  
}

export default Getuserdetailfromtoken
