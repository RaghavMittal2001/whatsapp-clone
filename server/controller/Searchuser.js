import User from "../model/User.js";
async function Searchuser(req,res) {
    try {
        const {search}=req.body;
        const query =new RegExp(search,'ig');
        const user =await User.find({
            "$or" :[
                { name :query},
                { email: query}
            ]
        }).select('-password')
        return res.status(200).json({
            message:"all user ",
            success:true,
            data : user
        })
    } catch (error) {
       return res.status(500).json({
        message :error.message || error,
        error:true
       }) 
    }
}
export default Searchuser
