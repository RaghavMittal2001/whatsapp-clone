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
    // //console.log(data);
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
    // //console.log(data);
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
      //console.log('data :', data)
      if(data.error)
        toast.error(data.message)
      else
      {
        toast.success(data.message)
        navigate('/email')
      }
    })
    .catch(err => {
      //console.log('err:', err)
      toast.error()
    });
    //console.log("Form submitted");
  };

  return (
    <div className='full-screen'>
      <Navbar />
      <Toaster/>
      <div className='mt-1 text-black' style={{ padding: "2", margin: "4 solid white", fontSize: "xxx-large" }}>
        <h2 className='mb-4'>Register Yourself Here!</h2>
        <form className='flex justify-center text-center' onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <div className='flex gap-2 mb-2 form-control'>
              <label htmlFor="name" className='m-2'>Name:</label>
              <input required type="text" id='name' name='name' placeholder='Enter your name' onChange={handleonchange} className='px-2 mx-4' style={{ backgroundColor: "#cbfee3", fontSize: 'x-large' }} />
            </div>
            <div className='flex gap-2 mb-2 form-control'>
              <label htmlFor="password" className='m-2'>Password:</label>
              <input required type="password" id='password' name='password' placeholder='Enter your password' onChange={handleonchange} className='' style={{ backgroundColor: "#cbfee3", fontSize: 'x-large' }} />
            </div>
            <div className='flex gap-2 mb-2 form-control'>
              <label htmlFor="email" className='m-2'>Email :</label>
              <input required type="email" id='email' name='email' placeholder='Enter your email'  className='mx-4 ' onChange={handleonchange} style={{ backgroundColor: "#cbfee3", fontSize: 'x-large' }} />
            </div>
            <div className='flex gap-2 mb-2 form-control'>
              <label htmlFor="profile_pic" className='mx-2'>Profile Photo:</label>
              <div className='inline-flex items-center justify-center mx-2 transition duration-300 border rounded cursor-pointer bg-slate hover:bg-green-200' style={{ backgroundColor: "#cbfee3", fontSize: 'medium' }}>
                <p className='mx-2 transition duration-300 border hover:border-primary'>
                  <input type="file" id='profile_pic' name='profile_pic' onChange={handleUploadFile} style={{ display: 'none' }} />
                  <span onClick={() => document.getElementById('profile_pic').click()}>
                    {uploadPhoto ? uploadPhoto.name : "Upload a photo"}
                  </span>
                </p>
                {uploadPhoto && (
                  <button type="button" className="btn-close " aria-label="Close" onClick={handleRemovePhoto}></button>
                )}
              </div>
            </div>
            <button  type="submit" disabled={loading} className='btn btn-success hover:bg-primary'>Register</button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default RegisterPage;
