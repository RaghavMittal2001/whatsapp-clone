import User from "../model/User.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'
const Checkpassword=async(req,res)=>{
    try {
        const { userid,password }=req.body;
        console.log(userid);
        const user = await User.findOne({ _id:userid });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true
            });
        }
        const verifypassword=await bcryptjs.compare(password ,user.password);
        if (verifypassword) {
            const  tokendata={
                id:user._id,
                email:user.email
            }
            const token = jwt.sign(tokendata,process.env.Jwt_Secret_Key);
            const cokkieoptions={
                http:true,
                secure:true
            }
            return res.cookie('token',token,cokkieoptions).status(200).json({
                message:"Login successfully ",
                success:true,
                data: user
            })
        } else {
            return res.status(400).json({
                message:"Password is incorrect ",
                error:true
            })
        }

        
    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error:true
        })
    }

}

export default Checkpassword
