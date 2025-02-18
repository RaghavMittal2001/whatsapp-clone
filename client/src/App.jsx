import './App.css';
import React from 'react';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      {/* <Header /> This is a global header for your app */}
      <div className='container'>
        <Outlet /> {/* Child routes will be rendered here */}
      </div>
      {/* <Footer /> This is a global footer */}
    </div>
  );
}

export default App;
