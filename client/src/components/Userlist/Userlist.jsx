import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserMessagecard from "../UserMessageCard/UserMessageCard";
import { motion } from "framer-motion";
import '../Userlist/Userlist.scss';

const Userlist = () => {
  const loggedInUser = useSelector((state) => state.user);
  const [allusers, setAllusers] = useState([]);
  const socketconnection = useSelector((state) => state.user.socketconnection);

  useEffect(() => {
    if (!socketconnection || !loggedInUser?._id) {
      console.error("Socket connection or user ID is missing.");
      return;
    }

    socketconnection.emit("get_conversation", loggedInUser._id);
    
    const handleConversations = (data) => {
      setAllusers(data);
    };
    
    socketconnection.on("all_conversations", handleConversations);

    return () => {
      socketconnection.off("all_conversations", handleConversations);
    };
  }, [loggedInUser, socketconnection]);

  return (
    <div className="max-w-6xl p-6 mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Messages
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Connect and chat with your contacts
        </p>
      </div>

      {/* User List */}
      {allusers.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {console.log("All users:", allusers)
          }
          {allusers.map((user, index) => (
            <div className="app__userlist_users" key={`${user.sender}-${index}`}>
              <UserMessagecard user={user} />           
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center py-8 text-center text-gray-500 dark:text-gray-400"
        >
          <p className="text-lg font-medium">No conversations yet.</p>
          <p className="text-sm">Start chatting by adding new users!</p>
        </motion.div>
      )}
    </div>
  );
};

export default Userlist;