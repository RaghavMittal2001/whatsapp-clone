import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { current } from "@reduxjs/toolkit";

const UserMessagecard = ({ user }) => {
  const navigate = useNavigate();
  const [currentuser, setcurrentuser] = useState({});
  const socketconnection = useSelector((state) => state.user.socketconnection);

  useEffect(() => {
    if (!socketconnection || !user?.sender) return;
    setcurrentuser(user.senderDetails);
  }, [user, socketconnection]);

  const handleNavigation = (event) => {
    event.preventDefault();
    navigate(`/${user.sender}`);
  };

  return (
    <div
      onClick={handleNavigation}
      // className="flex flex-col  cursor-pointer hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]  dark:border-[#222e35] transition-colors"
    >
      <div
        className="flex items-start p-3 cursor-pointer hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] border-b border-[#e9edef] dark:border-[#222e35] transition-colors"  
      >
        <Avatar className="flex-shrink-0 w-12 h-12 mr-3">
          <AvatarImage src={currentuser?.profile_pic} alt={currentuser.name} />
          <AvatarFallback>{currentuser?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-medium truncate">{currentuser.name}</h3>
            <span className="text-xs text-[#667781] dark:text-[#8696a0]">
              {currentuser?.time || "22pm"}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-[#667781] dark:text-[#8696a0] truncate">
              {user.lastMsg?.text || "No recent messages"}
            </p> 
            {/* {chat.unread > 0 && ( */}
              <span className="bg-[#25d366] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {"5" || user.lastmessages.count || "No recent "}
              </span>
            {/* )} */}
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default UserMessagecard;
