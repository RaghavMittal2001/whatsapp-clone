import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import io from 'socket.io-client';
import { setonlineuser, settoken, setuser } from "../redux/userslice";


function Home() {
  const navigate = useNavigate();
  const d = useSelector(state => state.user)
  const dispatch = useDispatch();
  console.log('user',d)
  const fetchuserdetails = async () => {
    const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/userDetails`;
    await fetch(url, {
      credentials: "include",
    })
      .then((res) => res.json()) // Parse the response body as JSON
      .then((data) => {
        console.log("Current user details:", data);
        if (data.data.logout) {
          alert(data.data.message)
          navigate('/email')
        }
        dispatch(setuser({
          _id:data.data._id,
          name:data.data.name,
          email:data.data.email,
          profile_pic:data.data.profile_pic
          
       } ))
       dispatch(settoken(data.token));
      })
      .catch((err) => console.log("error:", err));
  };
  useEffect(() => {
    fetchuserdetails();

  }, []);

  useEffect(() => {
    const socketconnection = io(import.meta.env.VITE_REACT_APP_BACKEND_URL, {
      withCredentials: true,
      auth: {
        token: localStorage.getItem('token')
      },
    })
    socketconnection.on('onlineuser', (data) => {
      console.log(data);
      dispatch(setonlineuser(data));
    })

    socketconnection.on('connect', () => {
      console.log('Connected to server:', socketconnection.id);
    });
    socketconnection.on('error', (data) => {
      console.error('socket error:', data.message);
      if (data.message === 'Token has expired. Please log in again.') {
        // Redirect to login or refresh the token
      }
    })
    socketconnection.on('disconnect', () => {
      console.log('Disconnected from server');
    });
    return () => {
      if (socketconnection) {
        socketconnection.disconnect();
        console.log('Socket connection closed');
      }
    };
  
  }, [])

  return (
    <div className="home-container">
      <aside className="sidebar ">
        {/* Sidebar content */}
        <Sidebar />
      
      </aside>
      <main className="main-content">
        <Outlet />
        
      </main>
    </div>

  );
}

export default Home;
