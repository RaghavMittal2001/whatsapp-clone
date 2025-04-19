import User from "../model/User.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'
const Checkpassword=async(req,res)=>{
    try {
        const { userid ,password }=req.body; 
        //console.log(userid,"i am in check password in server");
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
            const token = jwt.sign(tokendata,process.env.Jwt_Secret_Key,{ expiresIn: '7d' });
            const cookieOptions={
                http:true,
                sameSite: 'Strict', // Restrict sending the cookie with cross-site requests
                maxAge: 3600000, 
                secure:true
            }
            return res.cookie('token',token,cookieOptions).status(200).json({
                message:"Login successfully ",
                success:true,
                data: user,
                token:token
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
