import React, { useState } from "react";
import Navbar from "./Navbar";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom"; // Adjust the path as necessary

function CheckEmailPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
  });
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Add your form submission logic here
    console.log(data);
    const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL.replace(
      /\/$/,
      ""
    )}/api/LoginEmail`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log("response:", response);
        if (!response.ok) {
          throw new Error(
            "Network response was not ok",
            response.json().then((data) => {
              console.log("message:", data);
              return data.message;
            })
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("data :", data);
        if (data.error) toast.error(data.message);
        else {
          toast.success(data.message);
          navigate("/password", {
            state: data.data,
          });
        }
      })
      .catch((err) => {
        console.log("err:", err);
        toast.error();
      });
    console.log("Form submitted");
  };
  const handleonchange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <div
      className="flex flex-col bg-center bg-cover"
      style={{ backgroundImage: "url('/assets/back.avif')" }} // <- Your image path here
    >
      <Navbar />

      <div className="flex items-center justify-center flex-grow bg-white bg-opacity-80 backdrop-blur-sm">
        <div className="w-full max-w-md p-10 text-black bg-white shadow-xl rounded-xl">
          <h2 className="mb-6 text-3xl font-semibold text-center">
            Login Email
          </h2>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 text-lg">
              <label htmlFor="email" className="font-medium">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleonchange}
                placeholder="Enter your email"
                className="px-4 py-2 text-black bg-green-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2 text-white transition bg-green-500 rounded-md hover:bg-green-600"
            >
              Login
            </button>
          </form>
          <p className="mt-6 text-lg text-center">
            New User?{" "}
            <Link
              to="/register"
              className="text-green-600 transition duration-300 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CheckEmailPage;
