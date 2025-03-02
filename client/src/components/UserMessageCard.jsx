import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { motion } from "framer-motion";

const UserMessagecard = ({ user }) => { 
  const navigate = useNavigate();
  const [currentuser, setcurrentuser] = useState([]);
  const socketconnection = useSelector((state) => state.user.socketconnection);

  useEffect(() => {
    if (!socketconnection || !user?.sender) return;

    console.log("Fetching user details for:", user.sender);

    const handledata = (data) => {
      console.log("User received:", data);
      setcurrentuser(data);
      console.log(currentuser.profile_pic);
    };

    socketconnection.emit("get_user", user.sender);
    socketconnection.off("user_details").on("user_details", handledata);

    return () => {
      socketconnection.off("user_details", handledata);
    };
  }, [user.sender, socketconnection]);

  const handleNavigation = (event) => {
    event.preventDefault();
    navigate(`/${user.sender}`);
  };

  return (
    <motion.div
      onClick={handleNavigation}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-4 p-3 transition-all bg-white border border-gray-300 shadow-md cursor-pointer dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:border-primary hover:shadow-lg"
      role="button"
      aria-label={`View profile of ${currentuser?.name || "Unknown User"}`}
    >
      {/* Profile Picture & Status Indicator */}
     
        <Avatar
          userid={currentuser?._id}
          name={currentuser?.name}
          height="56px"
          width="56px"
          imageurl={currentuser?.profile_pic}
        />
        {/* Online Status Indicator */}
        {currentuser?.online && (
          <span className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full bottom-1 right-1 dark:border-gray-800"></span>
        )}
      

      {/* User Details */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 truncate dark:text-gray-100">
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
// Compare this snippet from client/src/components/UserMessagecard.jsx