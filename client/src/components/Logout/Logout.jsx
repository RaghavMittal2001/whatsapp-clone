import React from 'react'
import './Logout.scss';
import { logout } from '../../redux/userslice';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
const Logout = () => {
    
    const dispatch = useDispatch();
    const handlelogout = () => {
        // Logic to clear session, token or logout
        dispatch(logout());
        localStorage.removeItem("token"); // Clear token from local storage
        console.log("User logged out");
        Navigate("/email"); // Redirect to login page (if applicable)
        // Redirect to login page (if applicable)
      } 
  return (
    <div>
      <div className="app__logout">
        
        <p className='app__text'>Do you want to LogOut ? </p>
        <div className='app__logout-buttons'>
            
        <button type='button' onClick={handlelogout} className='app__button'>Yes</button>
        <button type='button' className='app__button'>No</button>
        </div>
      </div>
    </div> 
  )
}

export default Logout
