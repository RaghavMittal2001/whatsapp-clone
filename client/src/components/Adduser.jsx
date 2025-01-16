import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5';
import Loading from './Loading';
import Usersearchcard from './Usersearchcard';

const Adduser = (temp) => {
  const [searchuser,setsearchuser]= useState([]);
  const [loading ,setloading ]=useState(true);
  const [search,setsearch]=useState('')
  const handlesearchuser =async()=>{
    const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/searchuser`;
    setloading(true);
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type":'application/json'
      },
      body: JSON.stringify({search:search})
    })
    .then(response => {
      return response.json();
  })
    .then((data )=> {
      setloading(false);
      if(data.error)
        toast.error(data.message)
      else
      { 
        setsearchuser(data.data);
      }
    })
    .catch(err => {
      console.log('err:', err)
      toast.error()
    });
   
  };

  useEffect(()=>{
    handlesearchuser();
  },[search ]) 

  console.log('searchuser',searchuser)
  return (
    <div>
      <div className='bg-white rounded h-14 overflow-hidden flex '>
         <input type="text"
         placeholder='Search user by name or email ' 
         onChange={(e)=>setsearch(e.target.value)}
         value={search}
         className='w-full outline-none py-1 h-full px-4 bg-white text-bold '/>
         <div className='h-14 w-14 flex justity-center items-center '>
          <IoSearchOutline size={25}/>
         </div>
           </div>

         <div className='p-3 bg-white mt-2 w-full rounded '>
          {
            search ==='' && (<></>)
          }
          {
            searchuser.length ===0 && !loading && (
              <p>no user found  </p>
            )
          }
          {
            loading && (
              <p>
                <Loading/>
              </p>
            )
          }
          {
            searchuser.length !==0  && !loading && search !=='' &&(
              searchuser.map((user,index)=>{
                return(
                  <Usersearchcard key={user._id} user={user} temp={temp}/>
                )
              })
            )
          }
         </div>
    </div>
  )
}

export default Adduser
