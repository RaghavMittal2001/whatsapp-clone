import { createBrowserRouter } from "react-router-dom";
import React from 'react';
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";
import Defaultpage from "../pages/Defaultpage";
import NotFoundPage from "../pages/NotFoundPage"; // Add this for 404

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "password",
        element: <CheckPasswordPage />,
      },
      {
        path: "email",
        element: <CheckEmailPage />,
      },
      {
        path: "",
        element: <Home />, // This is your layout component
        children: [
          {
            index: true, // Default route for Home
            element: <Defaultpage />,
          },
          {
            path: ":userId", // Dynamic user route
            element: <MessagePage />,
          },
        ],
      },
      // Catch-all route for 404
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
