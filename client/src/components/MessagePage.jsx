import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FaImage, FaVideo } from "react-icons/fa6";
import UploadFile from "../helper/UploadFile";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";
import background from "../assets/background.jpeg";
import {
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Video,
} from "lucide-react";
import { Input } from "./ui/input";
import * as Avatar from "@radix-ui/react-avatar";

const MessagePage = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [openUploader, setOpenUploader] = useState(false);
  const socketConnection = useSelector((state) => state.user.socketconnection);
  const loggedInUser = useSelector((state) => state.user);
  
  const [dataUser, setDataUser] = useState({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false,
  });
  
  const [allMessages, setAllMessages] = useState([]);
  const [message, setMessage] = useState({
    text: "",
    videoUrl: "",
    imageUrl: "",
  });

  // Memoized values
  const hasMediaPreview = useMemo(() => 
    message.imageUrl || message.videoUrl, 
    [message.imageUrl, message.videoUrl]
  );

  const canSendMessage = useMemo(() => 
    message.text.trim() || message.videoUrl || message.imageUrl, 
    [message.text, message.videoUrl, message.imageUrl]
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth"
      });
    }
  }, [allMessages]);

  // Memoized event handlers to prevent unnecessary re-renders
  const handleSendMessage = useCallback((event) => {
    event.preventDefault();
    
    if (!canSendMessage || !socketConnection) {
      if (!socketConnection) {
        console.error("No socket connection!");
      }
      return;
    }

    const messageData = {
      sender: loggedInUser._id,
      receiver: params.userId,
      text: message.text.trim(),
      videoUrl: message.videoUrl,
      imageUrl: message.imageUrl,
    };

    socketConnection.emit("new_message", messageData);
    
    // Clear message after sending
    setMessage({
      text: "",
      videoUrl: "",
      imageUrl: "",
    });
  }, [canSendMessage, socketConnection, loggedInUser._id, params.userId, message]);

  const handleUploadPhoto = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setOpenUploader(false);

    try {
      const uploadedPhoto = await UploadFile(file);
      setMessage((prev) => ({ 
        ...prev, 
        imageUrl: uploadedPhoto.url,
        videoUrl: "" // Clear video if image is uploaded
      }));
    } catch (error) {
      console.error("Image upload failed:", error.message);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = "";
    }
  }, []);

  const handleUploadVideo = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setOpenUploader(false);

    try {
      const uploadedVideo = await UploadFile(file);
      setMessage((prev) => ({ 
        ...prev, 
        videoUrl: uploadedVideo.url,
        imageUrl: "" // Clear image if video is uploaded
      }));
    } catch (error) {
      console.error("Video upload failed:", error.message);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = "";
    }
  }, []);

  const handleInputChange = useCallback((event) => {
    setMessage((prev) => ({
      ...prev,
      text: event.target.value
    }));
  }, []);

  const handleClearUpload = useCallback(() => {
    setMessage((prev) => ({
      ...prev,
      videoUrl: "",
      imageUrl: "",
    }));
  }, []);

  const handleMessageUser = useCallback((data) => {
    console.log("Received user details:", data);
    setDataUser(data);
  }, []);

  const handleRefreshPage = useCallback((data) => {
    console.log("Received all messages:", data.conversation.messages);
    setAllMessages(data.conversation.messages);
  }, []);

  const toggleUploader = useCallback(() => {
    setOpenUploader(prev => !prev);
  }, []);

  // Handle Enter key press for sending messages
  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(event);
    }
  }, [handleSendMessage]);

  // Socket event listeners
  useEffect(() => {
    if (!socketConnection || !params.userId) return;

    socketConnection.emit("message_page", params.userId);
    socketConnection.on("message_user", handleMessageUser);
    socketConnection.on("all_message", handleRefreshPage);

    return () => {
      socketConnection.off("message_user", handleMessageUser);
      socketConnection.off("all_message", handleRefreshPage);
    };
  }, [socketConnection, params.userId, handleMessageUser, handleRefreshPage]);

  // Close uploader when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openUploader) {
        setOpenUploader(false);
      }
    };

    if (openUploader) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openUploader]);

  return (
    <div
      style={{ backgroundImage: `url(${background})` }}
      className="w-full h-full min-h-screen bg-center bg-no-repeat bg-cover"
    >
      {/* Header */}
      <header className="sticky z-20 top-0 flex items-center justify-between p-3 bg-[#f0f2f5] dark:bg-[#202c33] border-l border-[#d1d7db] dark:border-[#8696a0]">
        <div className="flex items-center">
          <Avatar.Root className="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mr-3 overflow-hidden align-middle bg-gray-300 rounded-full">
            <Avatar.Image 
              src={dataUser.profile_pic} 
              alt={dataUser.name}
              className="object-cover w-full h-full rounded-full"
            />
            <Avatar.Fallback className="flex items-center justify-center w-full h-full text-sm font-medium text-gray-700 bg-gray-300">
              {dataUser.name.charAt(0).toUpperCase()}
            </Avatar.Fallback>
          </Avatar.Root>
          <div>
            <h3 className="text-base font-medium">{dataUser.name}</h3>
            <p className="text-xs text-[#667781] dark:text-[#8696a0]">
              {dataUser.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="text-[#54656f] dark:text-[#aebac1] hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors">
            <Search size={20} />
          </button>
          <button className="text-[#54656f] dark:text-[#aebac1] hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors">
            <Phone size={20} />
          </button>
          <button className="text-[#54656f] dark:text-[#aebac1] hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors">
            <Video size={20} />
          </button>
          <button className="text-[#54656f] dark:text-[#aebac1] hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Messages Section */}
      <section
        className="h-[calc(100vh-165px)] overflow-x-hidden overflow-y-scroll scrollbar-hide p-4 bg-slate-200 bg-opacity-5"
        style={{
          backgroundImage: "url('/whatsapp-bg.png')",
          backgroundSize: "contain",
        }}
      >
        {/* All Messages */}
        <div className="space-y-3">
          {allMessages.length > 0 ? (
            allMessages.map((msg, index) => {
              const isLast = index === allMessages.length - 1;
              const isSender = msg.msgby === loggedInUser._id;

              return (
                <div
                  key={msg._id || `msg-${index}`}
                  className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                >
                  <div className="relative max-w-[65%] px-3 py-2">
                    {/* Message Bubble */}
                    <div
                      className={`p-3 text-sm rounded-lg shadow-md ${
                        isSender
                          ? "bg-[#dcf8c6] text-black rounded-br-none"
                          : "bg-white text-black rounded-bl-none"
                      }`}
                    >
                      {/* Media Content */}
                      {(msg.imageUrl || msg.videoUrl) && (
                        <div className="relative max-w-xs mb-2 space-y-2 md:max-w-sm lg:max-w-md">
                          {msg.imageUrl && (
                            <img
                              src={msg.imageUrl}
                              alt="Sent"
                              className="object-cover w-full rounded-lg shadow-md cursor-pointer max-h-60"
                              onClick={() => window.open(msg.imageUrl, "_blank")}
                              loading="lazy"
                            />
                          )}
                          {msg.videoUrl && (
                            <video
                              src={msg.videoUrl}
                              controls
                              className="object-cover w-full rounded-lg shadow-md max-h-60"
                              preload="metadata"
                            />
                          )}
                        </div>
                      )}

                      {/* Text Message */}
                      {msg.text && (
                        <p className="break-words whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      )}

                      {/* Timestamp */}
                      <div className="flex justify-end mt-2 text-[0.65rem] text-[#667781] dark:text-[#8696a0]">
                        {msg.timestamp || new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    {/* Message Tail */}
                    <div
                      className={`absolute w-3 h-3 ${
                        isSender 
                          ? "bg-[#dcf8c6] right-[-6px] bottom-4" 
                          : "bg-white left-[-6px] bottom-4"
                      }`}
                      style={{
                        clipPath: isSender 
                          ? "polygon(0 0, 100% 0, 0 100%)"
                          : "polygon(100% 0, 0 0, 100% 100%)"
                      }}
                    />
                  </div>

                  {/* Scroll Anchor */}
                  {isLast && <div ref={messagesEndRef} />}
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-[#667781] dark:text-[#8696a0] text-lg">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}
        </div>

        {/* Media Preview Before Sending */}
        {hasMediaPreview && (
          <div className="sticky mt-4 bottom-4">
            {message.imageUrl && (
              <div className="relative flex justify-center p-4 rounded-lg shadow-lg bg-white/90 backdrop-blur-sm">
                <img
                  src={message.imageUrl}
                  alt="Preview"
                  className="object-cover max-w-xs rounded-lg max-h-60"
                />
                <button
                  className="absolute p-1 text-white transition-colors bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600"
                  onClick={handleClearUpload}
                  aria-label="Remove image"
                >
                  <IoClose size={20} />
                </button>
              </div>
            )}

            {message.videoUrl && (
              <div className="relative flex justify-center p-4 rounded-lg shadow-lg bg-white/90 backdrop-blur-sm">
                <video
                  src={message.videoUrl}
                  controls
                  autoPlay
                  muted
                  className="w-full max-w-sm rounded-lg aspect-video"
                />
                <button
                  className="absolute p-1 text-white transition-colors bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600"
                  onClick={handleClearUpload}
                  aria-label="Remove video"
                >
                  <IoClose size={20} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="p-4 rounded-lg shadow-lg bg-white/90 backdrop-blur-sm">
              <Loading size={20} />
              <p className="mt-2 text-sm text-gray-600">Uploading...</p>
            </div>
          </div>
        )}
      </section>

      {/* Message Input & Upload */}
      <section className="bg-[#f0f2f5] dark:bg-[#202c33] p-3 flex items-center gap-3 border-t border-[#d1d7db] dark:border-[#8696a0]">
        {/* Media Controls */}
        <div className="relative flex items-center">
          <div className="flex items-center space-x-3">
            <button 
              className="text-[#54656f] dark:text-[#8696a0] hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors"
              aria-label="Add emoji"
            >
              <Smile size={24} />
            </button>
            <button
              className="text-[#54656f] dark:text-[#8696a0] hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors"
              onClick={toggleUploader}
              aria-label="Attach file"
            >
              <Paperclip size={24} />
            </button>
          </div>

          {/* File Upload Menu */}
          {openUploader && (
            <div 
              className="absolute bottom-14 left-0 z-50 w-48 rounded-xl bg-white shadow-xl ring-1 ring-gray-200 dark:bg-[#2a2f32] dark:ring-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2">
                <label
                  htmlFor="uploadImage"
                  className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#3a3f42] rounded-lg transition-colors"
                >
                  <FaImage size={20} className="text-blue-500" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Photo
                  </span>
                </label>
                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadPhoto}
                  className="hidden"
                  disabled={loading}
                  accept="image/*"
                />

                <label
                  htmlFor="uploadVideo"
                  className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#3a3f42] rounded-lg transition-colors"
                >
                  <FaVideo size={20} className="text-green-500" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Video
                  </span>
                </label>
                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                  disabled={loading}
                  accept="video/*"
                />
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <Input
          type="text"
          placeholder="Type a message"
          className="flex-1 bg-white dark:bg-[#2a3942] border-0 focus-visible:ring-2 focus-visible:ring-[#00a884] focus-visible:ring-offset-0 text-[#111b21] dark:text-[#e9edef] py-3 px-4 rounded-lg text-base"
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          value={message.text}
          disabled={loading}
        />

        {/* Send/Mic Button */}
        <button
          className={`p-3 rounded-full transition-all ${
            canSendMessage
              ? "bg-[#00a884] hover:bg-[#008f72] text-white shadow-lg"
              : "text-[#54656f] dark:text-[#8696a0] hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          onClick={handleSendMessage}
          disabled={loading}
          aria-label={canSendMessage ? "Send message" : "Record voice message"}
        >
          {canSendMessage ? (
            <Send size={20} />
          ) : (
            <Mic size={20} />
          )}
        </button>
      </section>
    </div>
  );
};

export default MessagePage;