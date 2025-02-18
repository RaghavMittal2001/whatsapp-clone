import React, { Suspense, lazy } from "react";
import { Outlet } from "react-router-dom";

// Lazy load Sidebar for performance optimization
const Sidebar = lazy(() => import("./Sidebar"));

const Layout = () => {
  return (
    <div className="home-container flex min-h-screen overflow-hidden">
      {/* Sidebar remains fixed */}
      <Suspense fallback={<div>Loading Sidebar...</div>}>
        <Sidebar />
      </Suspense>

      {/* Main Content updates dynamically */}
      <main className="main-content flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
