import React, { useEffect, useState, useCallback } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Loading from "./Loading";
import Usersearchcard from "./Usersearchcard";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const Adduser = ({ temp }) => {  // Corrected the prop destructuring
  const onlineUsers = useSelector((state) => state.user.onlineuser);
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Debounced API call function
  const handleSearchUser = useCallback(async () => {
    if (search.trim() === "") {
      setSearchUser([]); // Clear results when input is empty
      return;
    }

    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/searchuser`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.error) {
        toast.error(data.message);
      } else {
        setSearchUser(data.data);
      }
    } catch (err) {
      setLoading(false);
      console.error("Error fetching users:", err);
      toast.error("Something went wrong! Please try again.");
    }
  }, [search]);

  // Debounce effect to optimize API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearchUser();
    }, 500); // Adjust debounce delay as needed

    return () => clearTimeout(delayDebounceFn);
  }, [search, handleSearchUser]);

  console.log("Online Users:", onlineUsers);
  console.log("Search Results:", searchUser);

  return (
    <div>
      <Toaster />
      <div className="bg-white rounded h-14 overflow-hidden flex">
        <input
          type="text"
          placeholder="Search user by name or email"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="w-full outline-none py-1 h-full px-4 bg-white font-bold"
        />
        <div className="h-14 w-14 flex justify-center items-center">
          <IoSearchOutline size={25} />
        </div>
      </div>

      <div className="p-3 bg-white mt-2 w-full rounded">
        {search === "" && <></>}
        {!loading && searchUser.length === 0 && search !== "" && <p>No user found</p>}
        {loading && <p><Loading /></p>}

        {!loading && searchUser.length !== 0 && search !== "" &&
          searchUser.map((user) => (
            <Usersearchcard key={user._id} user={user} profile_pic={user.profile_pic} temp={temp} />
          ))
        }
      </div>
    </div>
  );
};

export default Adduser;
