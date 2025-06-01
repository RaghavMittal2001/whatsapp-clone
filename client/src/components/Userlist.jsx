import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserMessagecard from "./UserMessageCard";
import { motion } from "framer-motion";
import { Archive, Search } from "lucide-react";
import { Input } from "./ui/input";

const Userlist = () => {
  const loggedInUser = useSelector((state) => state.user);
  const [allusers, setAllusers] = useState([]);
  const socketconnection = useSelector((state) => state.user.socketconnection);

  useEffect(() => {
    //check if token is present in local storage
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Token not found in local storage.");
      return;
    }
    // Check if socketconnection and loggedInUser are available before emitting the event
    if (!socketconnection || !loggedInUser?._id) {
      console.log("Socket connection or user ID is missing.");
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
    <div>
      
      {/* Search Bar */}
     <div className="p-2 bg-[#f0f2f5] dark:bg-[#111b21]">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-[#54656f] dark:text-[#aebac1]" />
          </div>
          <Input
            type="search"
            placeholder="Search or start new chat"
            className="bg-white dark:bg-[#202c33] px-8 py-2 text-sm rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 border-0"
            
          />
        </div>
      </div>

      {/* Archived */}
     <div className="flex items-center py-3 px-4 hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] cursor-pointer">
        <Archive className="h-5 w-5 text-[#00a884] dark:text-[#00a884] mr-6" />
        <span className="text-sm">Archived</span>
      </div>
      {/* User List */}
      {allusers.length > 0 ? (
        <div className="flex-1 overflow-y-auto">
          {allusers.map((user, index) => (
            <UserMessagecard user={user} key={`${user.sender}-${index}`} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium">No conversations yet.</p>
          <p className="text-sm">Start chatting by adding new users!</p>
        </div>
      )}
    </div>
  );
};

export default Userlist;
