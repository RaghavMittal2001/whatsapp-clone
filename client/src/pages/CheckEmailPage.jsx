import React, { useState } from 'react';
import Navbar from './Navbar';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


function CheckEmailPage() {
  const navigate =useNavigate();
  const [data, setData] = useState({
    email: ""
    })
  const handleSubmit = async(event) => {
    event.preventDefault();

    // Add your form submission logic here
    // //console.log(data);
    const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/LoginEmail`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type":'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      // //console.log('response:', response);
      if (!response.ok) {
        
          throw new Error('Network response was not ok',response.json().then((data) => {
            //console.log('message:',data);
            return data.message
          }));
      }
      return response.json();
  })
    .then((data )=> {
      //console.log('data :', data)
      if(data.error)
        toast.error(data.message)
      else
      {
        toast.success(data.message)
        navigate('/password',{
          state:data.data
        })
      }
    })
    .catch(err => {
      //console.log('err:', err)
      toast.error()
    });
    //console.log("Form submitted");
  };
  const handleonchange = (e) => {


    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })

  }

  return (
    <div>
       <div className='full-screen'>
      <Navbar/>
      <div className='mt-1 text-black' style={{ padding: "2", margin: "4 solid white", fontSize: "xxx-large" }}>
        <h2 className='my-4 mb-4'>Login Email </h2>
        <form className='flex justify-center text-center' onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            
            <div className='flex gap-2 mb-2 form-control' style={{fontSize: "xx-large"}}>
              <label htmlFor="email" className='mx-2' >Email:</label>
              <input type="email" id='email' name='email' onChange={handleonchange} placeholder='Enter your email' style={{ backgroundColor: "#cbfee3", fontSize: 'x-large',padding:'5px' }} />
            </div>
            <button type="submit" className='btn btn-success'>Login</button>
          </div>
        </form>
      </div>
    </div>
    </div>
  )
}

export default CheckEmailPage
