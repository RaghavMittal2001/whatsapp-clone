import jwt from "jsonwebtoken"
import User from "../model/User.js";


const Getuserdetailfromtoken=(token)=> {
  if(!token){
    return {
        message:"session out",
        logout:true
    }
  }
  const decode =jwt.verify(token,process.env.Jwt_Secret_Key);
  
  const user= User.findOne({_id:decode.id}).select("-password");
//   console.log(user);
    return user ;
}

export default Getuserdetailfromtoken
