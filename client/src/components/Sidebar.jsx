import React, { useState } from "react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { FaRegUserCircle } from "react-icons/fa";

import Userlist from "./Userlist";
import Adduser from "./Adduser";
import Editprofile from "./Editprofile";
function Sidebar() {
  const handlelogout=()=>{
    
  }
  const [temp,settemp]=useState(0)
  return (

    <div className="home-container">
      <aside
        className="sidebar flex flex-col justify-between"
        style={{ backgroundColor: "rgb(40 200 26 / 55%)", width: "15%" }}
      >
        <div className="">
          <NavLink
        
            className={({ isActive }) =>
              `flex justify-center items-center h-14 cursor-pointer hover:scale-110 rounded ${
                isActive || "bg-gray-200"
              }`
            }
            onClick={()=>settemp(0)}
            title="Chat"
          >
            <div >
              <IoChatbubbleEllipsesSharp color="black" size={40} />
            </div>
          </NavLink>
          <NavLink
           onClick={()=>settemp(1)}
            className="flex justify-center items-center h-14 cursor-pointer hover:scale-110"
            title="Add friend ">
            <FaUserPlus color="black" size={40} />
          </NavLink>
        </div>
        <div>
        <NavLink
           onClick={()=>settemp(2)}
            className="flex justify-center items-center h-14 cursor-pointer hover:scale-110"
            title="Add friend ">
            < FaRegUserCircle color="black" size={40} />
          </NavLink>
          <button className="flex justify-center items-center h-14 cursor-pointer hover:scale-110" onClick={handlelogout}>
            <span className="-ml-1">
              <BiLogOut size={40} />
            </span>
          </button>
        </div>
      </aside>
      <main className="main-content">
         {
          (temp===0) && <Userlist/>
         }
         {
          (temp===1) && <Adduser temp={temp}/>
         }
         {
          (temp===2) && <Editprofile/>
         }
      </main>
    </div>
  );
}

export default Sidebar;
