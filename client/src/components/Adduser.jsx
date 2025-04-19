import React, { useEffect, useState, useCallback } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Loading from "./Loading";
import Usersearchcard from "./Usersearchcard";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const Adduser = () => {
  const onlineUsers = useSelector((state) => state.user.onlineuser);
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // API Call Function with Debounce
  const handleSearchUser = useCallback(async () => {
    if (!search.trim()) {
      setSearchUser([]); // Clear results when empty
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL.replace(/\/$/, '')}/api/searchuser`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (data.error) {
        toast.error(data.message);
      } else {
        setSearchUser(data.data);
      }
    } catch (err) {
      setLoading(false);
      //console.error("Error fetching users:", err);
      toast.error("Something went wrong! Please try again.");
    }
  }, [search]);

  // Debounce Effect
  useEffect(() => {
    if (!search.trim()) {
      setSearchUser([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      handleSearchUser();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, handleSearchUser]);

  //console.log("Online Users:", onlineUsers);
  //console.log("Search Results:", searchUser);

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <Toaster />
      
      {/* Search Bar */}
      <div className="relative flex items-center w-full overflow-hidden bg-gray-100 rounded-lg">
        <label htmlFor="search" className="w-full sr-only">
          Search user by name or email
        </label>
        <input
          id="search"
          type="text"
          placeholder="  Search user by name or email..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="w-full h-12 text-sm font-medium bg-transparent outline-none px-"
          aria-label="Search user"
        />
        <div className="flex items-center justify-center w-12 h-12 text-gray-500">
          <IoSearchOutline size={22} />
        </div>
      </div>

      {/* Search Results */}
      <div className="w-full p-3 mt-3 bg-white rounded">
        {search === "" && null}
        {loading && (
          <div className="flex items-center justify-center mt-4">
            <Loading />
          </div>
        )}
        {!loading && searchUser.length === 0 && search !== "" && (
          <p className="text-center text-gray-500">No user found</p>
        )}
        {!loading &&
          searchUser.length !== 0 &&
          search !== "" &&
          searchUser.map((user) => (
            <Usersearchcard
              key={user._id}
              user={user}
              profile_pic={user.profile_pic}
              
            />
          ))}
      </div>
    </div>
  );
};

export default Adduser;
