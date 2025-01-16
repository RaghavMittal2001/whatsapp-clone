import React, { useState } from "react";

const Userlist = () => {
  const [alluser, setalluer] = useState([]);

  return (
    <div>
        <div className="font-bold text-2xl ">
            Message
        </div>
      {alluser.length === 0 && (
        <div>
          <p className="test-lg text-center">
            explore User to start a convertion
          </p>
        </div>
      )}
    </div>
  );
};

export default Userlist;
