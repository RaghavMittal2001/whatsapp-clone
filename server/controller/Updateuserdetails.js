import Getuserdetailfromtoken from "../Helper/Getuserdetailfromtoken.js";
import User from "../model/User.js";

const UpdateUser=async(req,res)=>{
    try {
         const token =req.cookies.token || '';
         const user =Getuserdetailfromtoken(token);

         const {name,profile_pic} =req.body;
         const UpdateUser= await User.updateOne({_id:user.id},{
            name,
            profile_pic
         })
        const userinfo= await User.find({_id:user.id});
        res.status(200).json({
            message: "user details",
            success :true,
            data:userinfo
        })
    } catch (error) {
        return res.status(400).json({
            message:error.message || error,
            error:true
        })
    }
}
export default UpdateUser;