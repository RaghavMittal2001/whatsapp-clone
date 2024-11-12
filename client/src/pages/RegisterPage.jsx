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
    // console.log(data);
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
    const { value } = event.target;
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
    const { name } = event.target;
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
    // console.log(data);
    const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/register`;
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
    <div className='full-screen'>
      <Navbar />
      <Toaster/>
      <div className='text-black mt-1' style={{ padding: "2", margin: "4 solid white", fontSize: "xxx-large" }}>
        <h2 className='mb-4'>Register Yourself Here!</h2>
        <form className='flex justify-center text-center' onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <div className='mb-2 form-control flex gap-2'>
              <label htmlFor="name" className='m-2'>Name:</label>
              <input required type="text" id='name' name='name' placeholder='Enter your name' onChange={handleonchange} className='px-2' style={{ backgroundColor: "#cbfee3", fontSize: 'x-large' }} />
            </div>
            <div className='form-control mb-2 flex gap-2'>
              <label htmlFor="password" className='mx-2'>Password:</label>
              <input required type="password" id='password' name='password' placeholder='Enter your password' onChange={handleonchange} style={{ backgroundColor: "#cbfee3", fontSize: 'x-large' }} />
            </div>
            <div className='form-control mb-2 flex gap-2'>
              <label htmlFor="email" className='mx-2'>Email:</label>
              <input required type="email" id='email' name='email' placeholder='Enter your email' onChange={handleonchange} style={{ backgroundColor: "#cbfee3", fontSize: 'x-large' }} />
            </div>
            <div className='form-control mb-2 flex gap-2'>
              <label htmlFor="profile_pic" className='mx-2'>Profile Photo:</label>
              <div className='bg-slate inline-flex mx-2 justify-center items-center border rounded hover:bg-green-200 transition duration-300 cursor-pointer' style={{ backgroundColor: "#cbfee3", fontSize: 'medium' }}>
                <p className='mx-2 border hover:border-primary transition duration-300'>
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
