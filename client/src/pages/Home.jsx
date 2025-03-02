import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import io from "socket.io-client";
import { setonlineuser, setsocketconnection, settoken, setuser } from "../redux/userslice";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);

  console.log("User State:", userState);

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/userDetails`;
      const response = await fetch(url, { credentials: "include" });
      const data = await response.json();

      console.log("Current user details:", data);

      if (data?.data?.logout) {
        console.error(data.data.message);
        navigate("/email");
        return;
      }

      dispatch(setuser({
        _id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        profile_pic: data.data.profile_pic,
      }));
      dispatch(settoken(data.token));
      
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_REACT_APP_BACKEND_URL, {
      withCredentials: true,
      auth: { token: localStorage.getItem("token") },
    });

    socket.on("onlineuser", (data) => {
      console.log("Online Users:", data);
      dispatch(setonlineuser(data));
    });

    dispatch(setsocketconnection(socket));

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("error", (data) => {
      console.error("Socket error:", data.message);
      if (data.message === "Token has expired. Please log in again.") {
        navigate("/email"); // Redirect to login page
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
      console.log("Socket connection closed");
    };
  }, []);

  return (
    <div className="flex h-screen home-container">
      {/* Sidebar */}
      <aside className="w-1/5 bg-gray-100 dark:bg-gray-900">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 bg-white dark:bg-gray-800">
        <Outlet />
      </main>
    </div>
  );
}

export default Home;
