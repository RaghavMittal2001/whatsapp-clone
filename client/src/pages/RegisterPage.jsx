import React, { useState } from 'react';
import Navbar from './Navbar';
import UploadFile from '../helper/UploadFile.jsx';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [loading,setloading]=useState(false)
  const navigate =useNavigate();
  const [data, setData] = useState({
    name: "",
    password: "",
    email: "",
    profile_pic: "http://res.cloudinary.com/dcguyy9ty/image/upload/v1731400864/ryp6qitzp67lwscgtpur.jpg"
  })
  const [uploadPhoto, setUploadPhoto] = useState(null);
  const handleonchange = (e) => {


    const { name, value } = e.target;
     console.log(data);
    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })

  }

  const handleUploadFile = async (event) => {
    event.preventDefault();
    setUploadPhoto({name:`Loading`})
    setloading(true);
    const file = event.target.files[0];
    const uploadedPhoto = await UploadFile(file);
  
    setData((prev) => {
      return {
        ...prev,
        profile_pic: uploadedPhoto.url
      };
    })
    if (file) {
      setUploadPhoto(file);
      setloading(false);
    }
  };

  const handleRemovePhoto = (event) => {
    event.preventDefault();

    setUploadPhoto(null);
    document.getElementById('profile_pic').value = null;
   
    setData((prev) => {
      return {
        ...prev,
        profile_pic: null
      }
    })
  };

  const handleSubmit = async(event) => {
    event.preventDefault();

    // Add your form submission logic here
     console.log(data);
    const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL.replace(/\/$/, '')}/api/register`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type":'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      // if (!response.ok) {
      //     throw new Error('Network response was not ok');
      // }
      return response.json();
  })
    .then((data )=> {
      console.log('data :', data)
      if(data.error)
        toast.error(data.message)
      else
      {
        toast.success(data.message)
        navigate('/email')
      }
    })
    .catch(err => {
      console.log('err:', err)
      toast.error()
    });
    console.log("Form submitted");
  };

  return (
    <div className="flex flex-col min-h-screen bg-center bg-cover" style={{ backgroundImage: "url('/assets/bg.jpg')" }}>
  <Navbar />
  <Toaster />

  <div className="flex items-center justify-center flex-grow px-4 py-8 bg-white bg-opacity-80 backdrop-blur-sm">
    <div className="w-full max-w-xl p-10 text-black bg-white shadow-xl rounded-xl">
      <h2 className="mb-6 text-3xl font-semibold text-center">Register Yourself Here!</h2>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="flex flex-col gap-1 text-lg">
          <label htmlFor="name" className="font-medium">Name:</label>
          <input
            required
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            onChange={handleonchange}
            className="px-4 py-2 text-black bg-green-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1 text-lg">
          <label htmlFor="password" className="font-medium">Password:</label>
          <input
            required
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleonchange}
            className="px-4 py-2 text-black bg-green-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1 text-lg">
          <label htmlFor="email" className="font-medium">Email:</label>
          <input
            required
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleonchange}
            className="px-4 py-2 text-black bg-green-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Profile Photo */}
        <div className="flex flex-col gap-2">
          <label htmlFor="profile_pic" className="font-medium">Profile Photo:</label>
          <div className="flex items-center gap-4 px-4 py-2 transition bg-green-100 rounded-md cursor-pointer hover:bg-green-200">
            <span
              className="text-black"
              onClick={() => document.getElementById('profile_pic').click()}
            >
              {uploadPhoto ? uploadPhoto.name : "Upload a photo"}
            </span>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              onChange={handleUploadFile}
              className="hidden"
            />
            {uploadPhoto && (
              <button
                type="button"
                className="text-sm text-red-500 hover:underline"
                onClick={handleRemovePhoto}
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 text-lg text-white transition bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-60"
        >
          Register
        </button>
      </form>
    </div>
  </div>
</div>

  );
}

export default RegisterPage;
