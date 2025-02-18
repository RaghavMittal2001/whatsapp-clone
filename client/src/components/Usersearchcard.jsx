import React from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const Usersearchcard = ({ user }) => {
  const navigate = useNavigate(); // Hook for navigation
  const onlineuser = useSelector((state) => state.user.onlineuser);
  const isonline = onlineuser?.includes(user._id) || false;
  const handleNavigation = (event) => {
    event.preventDefault(); // Prevent default link behavior
    navigate(`/${user._id}`); // Navigate without refreshing
  };

  return (
    <div
      onClick={handleNavigation}
      className="flex items-center gap-3 p-2 rounded border-transparent border-t-slate-200 hover:border hover:border-primary hover:bg-primary/10 cursor-pointer"
      role="button"
      aria-label={`View profile of ${user.name}`}
    >
      <Avatar
        userid={user._id}
        name={user.name}
        height="100px"
        width="100px"
        imageurl={user.profile_pic}
      />
      <div>
        <div className="font-semibold px-4 line-clamp-1 text-ellipsis">
          {user.name}
        </div>
        <div>
          {isonline && (<div>(online)</div>)}
        </div>
        <p className="line-clamp-1 text-ellipsis">{user.email}</p>
      </div>
    </div>
  );
};

Usersearchcard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    profile_pic: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default Usersearchcard;
