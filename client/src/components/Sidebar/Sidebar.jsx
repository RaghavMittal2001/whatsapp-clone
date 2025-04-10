import React, { useState } from "react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaUserPlus, FaRegUserCircle } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";

import Userlist from "../Userlist/Userlist";
import Adduser from "../Adduser";
import Editprofile from "../Editprofile";
 import "./Sidebar.scss";

const Sidebar=()=> {
  const [temp, setTemp] = useState(0);

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
        <div className="">
          <div 
            // to={`/user/chat/${userId}`} // Ensure proper routing if needed
            className={({ isActive }) =>
              `  app__navigationbar-items ${
                isActive ? "bg-gray-200" : ""
              }`
            }
            onClick={() => {
              setTemp(0);
            }}
            title="Chat"
          >
            <IoChatbubbleEllipsesSharp color="black" size={40} />
          </div>
          <div
            // to="/add-friend" // Ensure routing
            onClick={() => setTemp(1)}
            className={({ isActive }) =>
              `flex justify-center items-center h-14 cursor-pointer hover:scale-110 app__navigationbar-items ${
                isActive ? "bg-gray-200" : ""
              }`
            }
            title="Add Friend"
          >
            <FaUserPlus color="black" size={40} />
          </div>
        </div>

        <div>
          <div
            // to="/profile" // Ensure routing
            onClick={() => setTemp(2)}
            className={({ isActive }) =>
              `flex justify-center items-center h-14 cursor-pointer hover:scale-110 app__navigationbar-items${
                isActive ? "bg-gray-200" : ""
              }`
            }
            title="Edit Profile"
          >
            <FaRegUserCircle color="black" size={40} />
          </div>
          <button
            className="flex items-center justify-center cursor-pointer h-14 hover:scale-110 "
            onClick={handleLogout}
          >
            <BiLogOut size={40} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        {temp === 0 && <Userlist />}
        {temp === 1 && <Adduser temp={temp} />}
        {temp === 2 && <Editprofile />}
      </main>
    </div>
  );
}

export default Sidebar;
