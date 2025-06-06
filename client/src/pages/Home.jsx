import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { setonlineuser, setsocketconnection, settoken, setuser } from "../redux/userslice";
import Sidebar from "../components/Sidebar.jsx";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);

  console.log("User State:", userState);
  const fetchUserDetails = async () => {
    try {
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL.replace(/\/$/, '')}/api/userDetails`;
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
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
// Fetch user details
const setupConnection = async () => {
  await fetchUserDetails();
  // Socket setup should be moved here if it depends on fetchUserDetails results
  
  // Get token from multiple possible sources
  let authtoken = userState.token;
  if (!authtoken) {
    authtoken = localStorage.getItem("token");
    console.log("Using localStorage token instead of Redux token");
  }
  
  // Debug token information
  console.log("Token available:", !!authtoken);
  if (authtoken) {
    console.log("Token starts with:", authtoken.substring(0, 15) + "...");
    console.log("Token length:", authtoken.length);
  }
  
  if (!authtoken) {
    console.error("No auth token available for socket connection");
    return;
  }
  
  // Socket connection with detailed logging
  console.log("Attempting socket connection to:", import.meta.env.VITE_REACT_APP_BACKEND_URL);
  const socket = io(import.meta.env.VITE_REACT_APP_BACKEND_URL.replace(/\/$/, ''), {
    withCredentials: true,
    auth: {
      token: authtoken },
        transports: ['polling']
      });
      
      socket.on("onlineuser", (data) => {
        console.log("Online Users:", data);
        dispatch(setonlineuser(data));
      });
      
      dispatch(setsocketconnection(socket));
      
      socket.on("connect", () => {
        console.log("Connected to server:", socket.id);
      });
      socket.on("connect_error", (error) => {
        console.error("Connection error:", error.message);
      });
      socket.on("error", (data) => {
        if(data && data.message) {
          console.error("Socket error:", data.message);
        }
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
    };
    setupConnection();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar remains fixed */}
      <div className="w-[30%] min-w-72 h-full">
        <Sidebar />
      </div>

      {/* Main Content updates dynamically */}
      <div className="flex-1 h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
