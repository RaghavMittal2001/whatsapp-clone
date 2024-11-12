import React from "react";
import Navbar from "./Navbar";

function CheckPasswordPage() {
  const [data, setData] = useState({
    email: "",
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Add your form submission logic here
    // console.log(data);
    const url = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/LoginEmail`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("data :", data);
        if (data.error) toast.error(data.message);
        else {
          toast.success(data.message);
          navigate("/password");
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
    <div>
      <div className="full-screen">
        <Navbar />

        <div
          className="text-black mt-1"
          style={{
            padding: "2",
            margin: "4 solid white",
            fontSize: "xxx-large",
          }}
        >
          <h2 className="mb-4 my-4">Login Password </h2>
          <form
            className="flex justify-center text-center"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-2">
              <div
                className="form-control mb-2 flex gap-2"
                style={{ fontSize: "xx-large" }}
              >
                <label htmlFor="Password" className="mx-2">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your Password"
                  style={{
                    backgroundColor: "#cbfee3",
                    fontSize: "x-large",
                    padding: "5px",
                  }}
                />
              </div>
              <button type="submit" className="btn btn-success">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckPasswordPage;
