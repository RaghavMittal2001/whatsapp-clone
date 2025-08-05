import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { settoken, setuser } from '../redux/userslice';


function CheckPasswordPage() {
 
  const navigate =useNavigate();
  const location =useLocation();
  const dispatch=useDispatch();
  console.log(location.state);
  useEffect(()=>{
    if ( !location?.state?.name) {
      console.log('No location, state, or state.name present');
      navigate('/email');
    }
    else(
      setData({
        userid:location.state._id,
        password: "",
      })
    )
   
  },[])
  
  const [data, setData] = useState({
    userid:'',
    password: "",
  });
  const d=useSelector(state=>state.user)
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Add your form submission logic here
    console.log(data);
    const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL.replace(/\/$/, '')}/api/LoginPassword`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: 'include', 
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log("data :", data);
        if (data.error) toast.error(data.message);
        else {
          toast.success(data.message);
          console.log(data)
          dispatch(setuser({
            _id:data.data._id,
            name:data.data.name,
            email:data.data.email,
            profile_pic:data.data.profile_pic
          }));
          dispatch(settoken(data.token));
          localStorage.setItem('token',data.token)
          navigate("/");
        }
      })
      .catch((err) => {
        console.log("err:", err);
        toast.error(err.message || "Error logging in. Please try again.");
      });
      
    console.log("Form submitted");

  };
  const handleonchange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  return (
    <div className="flex flex-col bg-cover g-center n" style={{ backgroundImage: "url('/assets/bg.jpg')" }}>
  <Navbar />

  <div className="flex items-center justify-center flex-grow px-4 bg-white bg-opacity-80 backdrop-blur-sm">
    <div className="w-full max-w-md p-10 text-black bg-white shadow-xl rounded-xl">
      <h2 className="text-3xl font-semibold text-center ">Hi {location.state.name}</h2>
      <h6 className="mb-6 text-center ">{location.state.email}</h6>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
         
        <div className="flex flex-col gap-2 text-lg">
          <label htmlFor="password" className="font-medium">
            Password:
          </label>
          <input
            onChange={handleonchange}
            type="password"
            id="password"
            name="password"
            placeholder="Enter your Password"
            className="px-4 py-2 text-lg text-black bg-green-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 text-lg text-white transition bg-green-500 rounded-md hover:bg-green-600"
        >
          Let's Go
        </button>
      </form>

      <p className="mt-6 text-lg text-center">
        Switch User?{" "}
        <Link
          to="/login"
          className="text-green-600 transition duration-300 hover:underline"
        >
          SignIn
        </Link>
      </p>
    </div>
  </div>
</div>

  );
}

export default CheckPasswordPage;
