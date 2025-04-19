import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar";
import { motion } from "framer-motion";
import "../UserMessageCard/UserMessageCard.scss"; 

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
    <motion.div
      onClick={handleNavigation}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="app__userlist_users"
      role="button"
      aria-label={`View profile of ${currentuser?.name || "Unknown User"}`}
    >
      {/* Profile Picture & Status Indicator */}
      <div className="relative">
        <Avatar
          imageurl={currentuser?.profile_pic}
          height="h-14" 
          width="w-14"
        />
        {currentuser?.online && (
          <span className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full bottom-1 right-1 dark:border-gray-800"></span>
        )}
      </div>

      {/* User Details */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 truncate dark:text-gray-100">
          {//console.log(currentuser)
          }
          {currentuser?.name || "Unknown User"}
        </h3>
        <p className="text-sm text-gray-600 truncate dark:text-gray-300 opacity-80">
          {user.lastMsg?.text || "No recent messages"}
        </p>
      </div>
    </motion.div>
  );
};

export default UserMessagecard;