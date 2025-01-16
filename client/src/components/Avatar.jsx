import React from 'react'
import err from '../assets/error.jpeg'
import { useSelector } from 'react-redux';
function Avatar({userid ,name ,imageurl,height='50px' ,width='50px' }) {
  const onlineuser =useSelector(state=>state.user.onlineuser);

  const isonline=onlineuser.includes(userid);
  return (
    <div>
      
        <img src={imageurl || err} alt={name} style={{ height, width }} 
        onError={(e) => {
          // Fallback to error image if the provided image fails to load
          e.target.src = err;
        }}
        />
    </div>
  )
}

export default Avatar
