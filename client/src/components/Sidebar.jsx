import React from "react";
import Userlist from "./Userlist";
import Adduser from "./Adduser";
import Editprofile from "./Editprofile";
import Logout from "./Logout";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { History, MessageSquare, MoreVertical, Users } from "lucide-react";

const Sidebar=()=> {
  const temp = useSelector((state) => state.user.page);
  return (
    <div className="h-full flex flex-col bg-[#f0f2f5] border-r border-[#e9edef] dark:bg-[#111b21] dark:border-[#222e35]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#f0f2f5] dark:bg-[#202c33]">
        <Avatar className="w-10 h-10">
          <AvatarImage src="/avatars/avatar-user.jpg" alt="Your Profile" />
          <AvatarFallback>YP</AvatarFallback>
        </Avatar>
        <div className="flex space-x-4">
          <button className="text-[#54656f] dark:text-[#aebac1]">
            <Users size={22} />
          </button>
          <button className="text-[#54656f] dark:text-[#aebac1]">
            <History size={22} />
          </button>
          <button className="text-[#54656f] dark:text-[#aebac1]">
            <MessageSquare size={22} />
          </button>
          <button className="text-[#54656f] dark:text-[#aebac1]">
            <MoreVertical size={22} />
          </button>
        </div>
      </div>
        {temp === 0 && <Userlist />}
        {temp === 1 && <Adduser temp={temp} />}
        {temp === 2 && <Editprofile />}
        {temp===3 && <Logout/>}
      
    </div>
  );
}

export default Sidebar;
