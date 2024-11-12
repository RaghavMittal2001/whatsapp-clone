import User from "../model/User.js";


const Checkemail=async(req,res)=> {
  try {
    const {email} =req.body;
    const checkemail=await User.findOne({email}).select("-password"); 

    if(!checkemail){
        return res.status(400).json({
            message:"User not exit ",
            error:true
        })
    }
    return res.status(200).json({
        message:"email verified ",
        succcess:true,
        data:checkemail
    })
  } catch (error) { 
    return res.status(500).json({
        message:error.message || error,
        error:true
    })
  }
}

export default Checkemail;
