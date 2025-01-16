import express from 'express';
import Checkemail from '../controller/Checkemail.js';
import Checkpassword from '../controller/Checkpassword.js';
import Registeruser from '../controller/Registeruser.js';
import Userdetails from '../controller/Userdetails.js';
import Logout from '../controller/Logout.js';
import UpdateUser from '../controller/Updateuserdetails.js';
import Searchuser from '../controller/searchuser.js';

const router= express.Router();

router.post('/register',Registeruser);//create API
router.post('/LoginEmail',Checkemail);//checking User email 
router.post('/LoginPassword',Checkpassword) // Checking User password 
router.get('/userDetails',Userdetails) //Getting user details
router.get('/Logout',Logout) //Logout user 
router.post('/updateuser',UpdateUser) //updating user details 
router.post('/searchuser',Searchuser) //search  all users for one login user 
export default router; 