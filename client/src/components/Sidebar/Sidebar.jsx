import React, { useState } from "react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaUserPlus, FaRegUserCircle } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";

import Userlist from "../Userlist/Userlist";
import Adduser from "../Adduser";
import Editprofile from "../Editprofile";
 import "./Sidebar.scss";
import Logout from "../Logout/Logout";
import { useDispatch, useSelector } from "react-redux";
import { setpage } from "../../redux/userslice";

const Sidebar=()=> {
  const temp = useSelector((state) => state.user.page);
  const dispatch = useDispatch();
  // const [temp, setTemp] = useState(0); // 0: Userlist, 1: Adduser, 2: Editprofile
 
  const handleLogout = () => {
    // Logic to clear session, token or logout
    console.log("User logged out");
    // Redirect to login page (if applicable)
  };

  return (
    <div className="home-container">
      <aside
        className="app__navigationbar"
      >
        <div>
          <div 
            className={
              `  app__navigationbar-items `
            }
            onClick={() => {

              dispatch(setpage(0)); // Update the page state in Redux
            }}
            title="Chat"
          >
            <IoChatbubbleEllipsesSharp color="black" size={40} />
          </div>
          <div
            // to="/add-friend" // Ensure routing
            onClick={() => dispatch(setpage(1))}
            className={
              `app__navigationbar-items `
            }
            title="Add Friend"
          >
            <FaUserPlus color="black" size={40} />
          </div>
        </div>

        <div>
          <div
            // to="/profile" // Ensure routing
            onClick={() => dispatch(setpage(2))}
            className =' app__navigationbar-items'
             
       
            title="Edit Profile"
          >
            <FaRegUserCircle color="black" size={40} />
          </div>
          <div
            className =' app__navigationbar-items'
            onClick={()=> dispatch(setpage(3))} 
          >
            <BiLogOut size={40} />
          </div>
        </div>
      </aside>

      <main className="main-content">
        {temp === 0 && <Userlist />}
        {temp === 1 && <Adduser temp={temp} />}
        {temp === 2 && <Editprofile />}
        {temp===3 && <Logout/>}
      </main>
    </div>
  );
}

export default Sidebar;
