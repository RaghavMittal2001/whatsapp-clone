import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default:""
    },
    videoUrl: {
      type: String || URL,
      default:""
    },
    imageUrl: {
        type:String || URL,
        default:""
    },
    seen:{
        type:Boolean,
        default:false
    },
    msgby: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
