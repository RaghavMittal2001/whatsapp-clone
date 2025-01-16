import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routes/Index.jsx'; // Ensure the path is correct
import './index.css';
import {Provider }from 'react-redux';
import { store } from './redux/store.js';


const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
      <Provider store={store}>
    <RouterProvider router={router} />
      </Provider>
  </React.StrictMode>
);
