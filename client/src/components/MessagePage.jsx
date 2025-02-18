import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaImage, FaVideo } from "react-icons/fa6";
import { GrAttachment } from "react-icons/gr";
import UploadFile from "../helper/UploadFile";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";

const MessagePage = () => {
  const params = useParams();
  const socketconnection = useSelector((state) => state.user.socketconnection);
  const [datauser, setdatauser] = useState({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false,
  });

  const [openuploader, setopenuploader] = useState(false);
  const [message, setmessage] = useState({
    text: "",
    videoUrl: "",
    imageUrl: "",
  });

  const [loading, setloading] = useState(false);

  const handleUploadphoto = async (event) => {
    event.preventDefault();
    setloading(true);
    const file = event.target.files[0];
    setopenuploader(false);

    if (!file ) return alert("Invalid image file!");

    const uploadedPhoto = await UploadFile(file);

    setmessage((prev) => ({
      ...prev,
      imageUrl: uploadedPhoto.url,
    }));

    setloading(false);
  };

  const handleUploadvideo = async (event) => {
    event.preventDefault();
    setloading(true);
    console.log('loading', loading);
    
    const file = event.target.files[0];
    setopenuploader(false);

    if (!file ) return alert("Invalid video file!");

    const uploadedvideo = await UploadFile(file);

    setmessage((prev) => ({
      ...prev,
      videoUrl: uploadedvideo.url,
    }));

    setloading(false);
  };

  const handleclearupload = () => {
    setmessage({
      text: "",
      videoUrl: "",
      imageUrl: "",
    });
  };

  useEffect(() => {
    if (socketconnection) {
      socketconnection.emit("message_page", params.userId);
      const handleMessageUser = (data) => {
        console.log("Received user details:", data);
        setdatauser(data);
      };

      socketconnection.on("message_user", handleMessageUser);

      return () => {
        socketconnection.off("message_user", handleMessageUser);
      };
    }
  }, [socketconnection, params.userId]);

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 flex items-center justify-between h-16 px-4 rounded bg-secondary">
        <div className="flex items-center gap-2">
          <a href={datauser.profile_pic} target="_blank" rel="noopener noreferrer">
            <Avatar userid={datauser._id} imageurl={datauser.profile_pic} name={datauser.name} />
          </a>
          <div>
            <h3 className="my-1 text-lg font-semibold text-ellipsis line-clamp-1">{datauser.name}</h3>
            <p className="-my-1 text-sm">
              {datauser.online ? <span className="text-primary">online</span> : <span className="text-slate-400">offline</span>}
            </p>
          </div>
        </div>
        <button className="cursor-pointer hover:text-primary">
          <HiDotsVertical />
        </button>
      </header>

      {/* Messages Section */}
      <section className="h-[calc(100vh-180px)] overflow-x-hidden overflow-y-scroll scrollbar-hide p-4">
        {/* Placeholder for messages */}
        <div>All messages here...</div>

        {/* Uploaded Image Preview */}
        {message.imageUrl && (
          <div className="relative flex items-end justify-center w-full overflow-hidden rounded bg-slate-700 bg-opacity-30">
            <div className="p-3 bg-white rounded-lg shadow-md">
              <img src={message.imageUrl} width={300} height={300} alt="Uploaded" className="object-cover rounded-lg" />
            </div>
            <button className="absolute text-red-600 top-2 right-2" onClick={handleclearupload}>
              <IoClose size={30} />
            </button>
          </div>
        )}

        {/* Uploaded Video Preview */}
        {message.videoUrl && (
          <div className="relative flex items-end justify-center w-full overflow-hidden rounded bg-slate-800 bg-opacity-30">
            <div className="p-3 bg-white">
              <video src={message.videoUrl} width={400} height={400} className="w-full max-w-sm aspect-video" controls muted autoPlay />
            </div>
            <button className="absolute text-red-600 top-2 right-2" onClick={handleclearupload}>
              <IoClose size={30} />
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center">
            <Loading size={12} />
          </div>
        )}
      </section>

      {/* Message Input & Upload */}
      <section className="flex items-center h-16 px-4 bg-primary">
        <div className="relative">
          <button onClick={() => setopenuploader(!openuploader)} className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-opacity-80">
            <GrAttachment size={30} />
          </button>

          {openuploader && (
            <div className="absolute p-2 bg-white rounded shadow bottom-12 w-36">
              <form>
                <label htmlFor="uploadImage" className="flex items-center gap-3 p-2 px-2 cursor-pointer hover:bg-slate-200">
                  <FaImage size={18} className="text-primary" />
                  <p>Image</p>
                </label>
                <input type="file" id="uploadImage" onChange={handleUploadphoto} className="hidden" disabled={loading} accept="image/*" />

                <label htmlFor="uploadVideo" className="flex items-center gap-3 p-2 px-2 cursor-pointer hover:bg-slate-200">
                  <FaVideo size={18} className="text-primary" />
                  <p>Video</p>
                </label>
                <input type="file" id="uploadVideo" onChange={handleUploadvideo} className="hidden" disabled={loading} accept="video/*" />
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MessagePage;
