import express from "express";
const router = express.Router();
import Registeruser from "../controller/RegisterUser.js"; //importing Registeruser controller
import Checkemail from "../controller/Checkemail.js"; //importing Checkemail controller
import Checkpassword from "../controller/Checkpassword.js"; //importing Checkpassword controller
import Userdetails from "../controller/Userdetails.js"; //importing Userdetails controller
import Logout from "../controller/Logout.js"; //importing Logout controller
import UpdateUser from "../controller/Updateuserdetails.js"; //importing UpdateUser controller
import Searchuser from "../controller/Searchuser.js"; //importing Searchuser controller

router.post("/register", Registeruser); //create API
router.post("/LoginEmail", Checkemail); //checking User email
router.post("/LoginPassword", Checkpassword); // Checking User password
router.get("/userDetails", Userdetails); //Getting user details
router.get("/Logout", Logout); //Logout user
router.post("/updateuser", UpdateUser); //updating user details
router.post("/searchuser", Searchuser); //search  all users for one login user
export default router;
