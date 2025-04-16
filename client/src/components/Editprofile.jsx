import React from 'react'
import Avatar from './Avatar'
import { useSelector } from 'react-redux'

const Editprofile = () => {
  const user =useSelector ((state) => state.user);
  console.log("User State:", user);
  return (
    <div>
      
      <h1 className='text-3xl font-bold'>Edit Profile</h1>
      
      <h2 >User Name: {user.name}</h2>
      <h2 >User Email: {user.email}</h2>
      
      <Avatar imageurl={user.profile_pic} height='100px'  width='100px'/>
    </div>
  )
}

export default Editprofile
