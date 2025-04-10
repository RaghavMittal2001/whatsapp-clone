import React from 'react';
import errorImage from '../assets/error.jpeg';

const Avatar = ({ imageurl, height = 'h-12', width = 'w-12' }) => {
  return (
    <div className="p-2">
      <img 
        className={`rounded-full ${height} ${width}`}
        src={imageurl || errorImage}
        alt="User avatar"
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop
          e.target.src = errorImage;
        }}
      />
    </div>
  );
};

export default Avatar;