import Getuserdetailfromtoken from "../Helper/Getuserdetailfromtoken.js";


const Userdetails=async(req,res)=> {
  try {
    const token =req.cookies.token || "";
    const user =await Getuserdetailfromtoken(token);
    console.log(user);
    res.status(200).json({
        message:"user details",
        data:user,
        success:true
    })
  } catch (error) {
    return res.status(500).json({
        message:error.message || error,
        error:true
    })
  }
}

export default Userdetails
