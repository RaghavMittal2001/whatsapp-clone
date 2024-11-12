
import User from "../model/User.js";
import bcryptjs from 'bcryptjs';
const Registeruser= async(req,res)=>{
    try{
        const {name,password ,email,profile_pic}=req.body ;
        const checkemail=await User.findOne({ email });
        if(checkemail){
            return res.status(400).json({
                message:"Already user Exits",
                error:true
            })
        }

        //password hashing
        const salt =await bcryptjs.genSalt(10);
        const hashpassword=await bcryptjs.hash(password,salt);

        const payload={
            name,
            password:hashpassword,
            profile_pic,
            email
        }
        const user = new User(payload);
        const usersave=await user.save();
        console.log(user);
        return res.status(201).json({
            message:"User created succeesfully ",
            data:usersave,
            success:true
        })

    }catch(error){
        return res.status(500).json({
            message:error.message || error,
            error:true
        })
    }
}

export default Registeruser;