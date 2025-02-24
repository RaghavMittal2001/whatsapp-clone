import React from 'react'
import err from '../assets/error.jpeg'
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types'; // Import PropTypes
function Avatar({userid ,name ,imageurl,height='50px' ,width='50px' }) {
  const onlineuser =useSelector(state=>state.user.onlineuser);

  const isonline = onlineuser.includes(userid);
  
  return (
    <div className='p-2 border-rounded'>
      
        <img className="rounded-full" src={imageurl || err} alt={name} style={{ height, width }} 
        onError={(e) => {
          // Fallback to error image if the provided image fails to load
          e.target.src = err;
        }}
        />
    </div>
  )
}
Avatar.propTypes = {
  userid: PropTypes.string.isRequired, // `userid` is required and must be a string
  name: PropTypes.string,              // Optional string for the user's name
  imageurl: PropTypes.string,          // Optional string for the image URL
  height: PropTypes.string,            // Optional string for height
  width: PropTypes.string,             // Optional string for width
};
export default Avatar
