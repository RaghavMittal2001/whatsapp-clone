import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaImage, FaVideo } from "react-icons/fa6";
import { GrAttachment } from "react-icons/gr";
import UploadFile from "../helper/UploadFile";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";
import background from "../assets/background.jpeg";
import { IoSendSharp } from "react-icons/io5";

const MessagePage = () => {
  const params = useParams();
  const [loading, setloading] = useState(false);
  const [openuploader, setopenuploader] = useState(false);
  const socketconnection = useSelector((state) => state.user.socketconnection);
  const loggedInUser = useSelector((state) => state.user);
  const [datauser, setdatauser] = useState({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false,
  });
  const [allmessage, setallmessage] = useState([]);
  const currentmessage = useRef(null);

  const [message, setmessage] = useState({
    text: "",
    videoUrl: "",
    imageUrl: "",
  });
  useEffect(() => {
    if (currentmessage.current) {
      currentmessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [allmessage, message]);
  const handlesendmessage = (event) => {
    event.preventDefault();
    console.log("Message:", message);
    //log params userId
    console.log("params.userId", params.userId);
    if (message.text || message.videoUrl || message.imageUrl) {
      if (socketconnection) {
        socketconnection.emit("new_message", {
          sender: loggedInUser._id,
          receiver: params.userId,
          text: message.text,
          videoUrl: message.videoUrl,
          imageUrl: message.imageUrl,
        });

        const handleMessage = (data) => {
          console.log("new message", data.conversation.messages);
          setallmessage(data.conversation.messages);
        };
        setmessage({ text: "", videoUrl: "", imageUrl: "" });
        socketconnection.on("all_message", handleMessage);

        return () => {
          socketconnection.off("all_message");
        };
      } else {
        console.error("No socket connection!");
      }
    }
  };
  // Function to upload photos
  const handleUploadPhoto = async (event) => {
    event.preventDefault();
    setloading(true);
    setopenuploader(false);

    try {
      const file = event.target.files[0];
      if (!file) throw new Error("Invalid image file!");

      const uploadedPhoto = await UploadFile(file);
      setmessage((prev) => ({ ...prev, imageUrl: uploadedPhoto.url }));
    } catch (error) {
      console.error(error.message);
    } finally {
      setloading(false);
    }
  };
  const handleonchange = (event) => {
    const { name, value } = event.target;
    setmessage((prev) => {
      return { ...prev, text: value };
    });
  };
  // Function to upload videos
  const handleUploadVideo = async (event) => {
    event.preventDefault();
    setloading(true);
    setopenuploader(false);

    try {
      const file = event.target.files[0];
      if (!file) throw new Error("Invalid video file!");

      const uploadedVideo = await UploadFile(file);
      setmessage((prev) => ({ ...prev, videoUrl: uploadedVideo.url }));
    } catch (error) {
      console.error(error.message);
    } finally {
      setloading(false);
    }
  };
  // Function to clear uploaded files
  const handleclearupload = () => {
    setmessage({
      text: "",
      videoUrl: "",
      imageUrl: "",
    });
  };
  // Function to handle user details
  const handleMessageUser = (data) => {
    console.log("Received user details:", data);
    setdatauser(data);
  };
  const handleRefreshPage = (data) => {
    console.log("Received all messages:", data.conversation.messages);
    setallmessage(data.conversation.messages);
  };
  useEffect(() => {
    if (socketconnection) {
      socketconnection.emit("message_page", params.userId);

      socketconnection.on("message_user", handleMessageUser);
      socketconnection.on("all_message", handleRefreshPage)
      return () => {
        socketconnection.off("message_user", handleMessageUser);
        socketconnection.off("all_message", handleRefreshPage);
      };
    }
  }, [socketconnection, params.userId]);

  return (
    <div
      style={{ backgroundImage: `url(${background})` }}
      className="bg-no-repeat bg-cover "
    >
      {/* Header */}
      <header className="sticky top-0 flex items-center justify-between h-16 px-4 rounded bg-secondary">
        <div className="flex items-center gap-2">
          <a
            href={datauser.profile_pic}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Avatar
              userid={datauser._id}
              imageurl={datauser.profile_pic}
              name={datauser.name}
            />
          </a>
          <div>
            <h3 className="my-1 text-lg font-semibold text-ellipsis line-clamp-1">
              {datauser.name}
            </h3>
            <p className="-my-1 text-sm">
              {datauser.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>
        <button className="cursor-pointer hover:text-primary">
          <HiDotsVertical />
        </button>
      </header>

      {/* Messages Section */}
      <section className="h-[calc(100vh-180px)] overflow-x-hidden overflow-y-scroll scrollbar-hide p-4 bg-slate-200 bg-opacity-5">
        {/* Placeholder for All messages */}

        <div className="p-4 space-y-2">
          {allmessage.length > 0 ? (
            allmessage.map((msg, index) => (
              <div
                ref={currentmessage}
                key={msg._id || index}
                className={`flex ${
                  msg.msgby === loggedInUser._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="relative max-w-[100%] p-2 rounded-lg">
                  {/* Tail Effect */}
                  <div
                    className={`absolute w-4 h-4 bg-inherit rotate-45 ${
                      msg.msgby === loggedInUser._id
                        ? "right-[-5px] bottom-2"
                        : "left-[-5px] bottom-2"
                    }`}
                  ></div>

                  {/* Message Content */}
                  <div 
                  ref={currentmessage}
                    className={`p-2 text-sm rounded-lg shadow ${
                      msg.msgby === loggedInUser._id
                        ? "bg-green-500 text-black rounded-br-none" // Sender Bubble
                        : "bg-gray-200 text-black rounded-bl-none" // Receiver Bubble
                    }`}
                  >
                    <div className="relative max-w-xs p-2 md:max-w-sm lg:max-w-md">
                      {msg.imageUrl && (
                        <img
                          src={msg.imageUrl}
                          alt="Sent Image"
                          className="object-cover w-full rounded-lg shadow-md cursor-pointer max-h-60"
                          onClick={() => window.open(msg.imageUrl, "_blank")} // Open in new tab
                        />
                      )}
                      {msg.videoUrl && (
                        <video
                          src={msg.videoUrl}
                          controls
                          className="object-cover w-full rounded-lg shadow-md cursor-pointer max-h-60"
                        />
                      )}
                    </div>

                    <p>{msg.text}</p>
                    <p className="mt-1 text-xs text-right text-black text-opacity-50">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No messages yet.</p>
          )}
        </div>

        {/* Uploaded Image Preview */}
        {message.imageUrl && (
          <div className="relative flex items-end justify-center w-full overflow-hidden rounded bg-slate-700 bg-opacity-10">
            <div
              ref={currentmessage}
              className="p-3 bg-white rounded-lg shadow-md"
            >
              <img
                src={message.imageUrl}
                width={300}
                height={300}
                alt="Uploaded"
                className="object-cover rounded-lg"
              />
            </div>
            <button
              className="absolute text-red-600 top-2 right-2"
              onClick={handleclearupload}
            >
              <IoClose size={30} />
            </button>
          </div>
        )}

        {/* Uploaded Video Preview */}
        {message.videoUrl && (
          <div className="relative flex items-end justify-center w-full overflow-hidden rounded bg-slate-800 bg-opacity-30">
            <div ref={currentmessage} className="p-3 bg-white">
              <video
                src={message.videoUrl}
                width={400}
                height={400}
                className="w-full max-w-sm aspect-video"
                controls
                muted
                autoPlay
              />
            </div>
            <button
              className="absolute text-red-600 top-2 right-2"
              onClick={handleclearupload}
            >
              <IoClose size={30} />
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div ref={currentmessage} className="flex justify-center">
            <Loading size={20} />
          </div>
        )}
      </section>

      {/* Message Input & Upload */}
      <section className="flex items-center h-16 px-4 bg-primary ">
        <div className="relative">
          <button
            onClick={() => setopenuploader(!openuploader)}
            className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-opacity-80 hover:text-white"
          >
            <GrAttachment size={30} />
          </button>

          {openuploader && (
            <div className="absolute p-2 bg-white rounded shadow bottom-12 w-36">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center gap-3 p-2 px-2 cursor-pointer hover:bg-slate-200"
                >
                  <FaImage size={18} className="text-primary" />
                  <p>Image</p>
                </label>
                <input
                  ref={currentmessage}
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadPhoto}
                  className="hidden"
                  disabled={loading}
                  accept="image/*"
                />

                <label
                  htmlFor="uploadVideo"
                  className="flex items-center gap-3 p-2 px-2 cursor-pointer hover:bg-slate-200 "
                >
                  <FaVideo size={18} className="text-primary" />
                  <p>Video</p>
                </label>
                <input
                  ref={currentmessage}
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                  disabled={loading}
                  accept="video/*"
                />
              </form>
            </div>
          )}
        </div>
        {/* input box */}
        <form
          className="flex items-center justify-center w-full h-full"
          onSubmit={handlesendmessage}
        >
          <input
            id="message"
            type="text"
            value={message.text}
            onChange={handleonchange}
            placeholder="Type your message here.."
            className="relative w-full h-10 px-4 py-1 text-black outline-none bg-slate-200"
          />
          <button className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-opacity-80 hover:text-primary">
            <IoSendSharp size={28} className="" />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
