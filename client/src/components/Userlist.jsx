import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserMessagecard from "./UserMessagecard";
import { motion } from "framer-motion";

const Userlist = () => {
  const loggedInUser = useSelector((state) => state.user);
  const [allusers, setAllusers] = useState([]);
  const socketconnection = useSelector((state) => state.user.socketconnection);

  useEffect(() => {
    if (!socketconnection || !loggedInUser?._id) {
      console.error("Socket connection or user ID is missing.");
      return;
    }

    console.log("Fetching conversations for:", loggedInUser);

    socketconnection.emit("get_conversation", loggedInUser._id);
    socketconnection.on("all_conversations", (data) => {
      console.log("All conversations received:", data);
      setAllusers(data);
    });

    return () => {
      socketconnection.off("all_conversations");
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
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          <div>
          {allusers.map((user) => (
            <UserMessagecard key={user.sender} user={user} />
          ))}
      </div>
        </motion.div>
      ) 
      : (
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
