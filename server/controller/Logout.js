
const Logout=async(req,res)=>{
    try {
        const cokkieoptions={
            http:true,
            secure:true
        }
        return res.cookie(token,'',cokkieoptions).status(200).json({
            message:"session out ",
            success:true
        })
 
        
    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error:true
        })
    }

}

export default Logout
