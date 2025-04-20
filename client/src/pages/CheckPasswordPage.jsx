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
    <div>
      <div className="full-screen">
        <Navbar />

        <div
          className="mt-1 text-black"
          style={{
            padding: "2",
            margin: "4 solid white",
            fontSize: "xxx-large",
          }}
        >
          <h2 className="my-4 mb-4">Login Password </h2>
          <form
            className="flex justify-center text-center"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-2">
              <div
                className="flex gap-2 mb-2 form-control"
                style={{ fontSize: "xx-large" }}
              >
                <label htmlFor="Password" className="mx-2">
                  Password:
                </label>
                <input
                  onChange={handleonchange}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your Password"
                  style={{
                    backgroundColor: "#cbfee3",
                    fontSize: "x-large",
                    padding: "5px",
                  }}
                />
              </div>
              <button type="submit" className="btn btn-success">
               Let's Go
              </button>
            </div>
          </form>
          <p style={{fontSize:"x-large"}} className="my-3 mt-1 text-center">New User ? <Link className="transition duration-300 cursor-pointer hover:underline" to={"/register"} >Register</Link></p>
        </div>
      </div>
    </div>
  );
}

export default CheckPasswordPage;
