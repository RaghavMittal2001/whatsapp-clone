import React from 'react'
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Avatar from './Avatar';

const Usersearchcard = ({user}) => {
  const handleClick = () => {
    console.log("in Usersearchcard add collapse button");
  };
  return (
    <Link to={'/'+user._id} onClick={ handleClick} className='flex items-center gap-3 p-2 rounded  border-transparent border-t-slate-200 hover:border hover:border-primary hover:bg-primary/10 ' role="link" aria-label={`View profile of ${user.name}`}>
      <div>
         < Avatar   userid={user._id}
  name={user.name}
  height="100px"
  width="100px"
  imageurl={user.profile_pic}  />
      </div>
      <div>

      <div className='font-semibold px-4 line-champ-1 text-ellipsis'>
        {user.name}
      </div>
      <p className='line-champ-1 text-ellipsis'>
        {user.email}
      </p>
      </div>
    </Link>
  )
}

export default Usersearchcard
