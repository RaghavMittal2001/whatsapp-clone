import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref:"Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("conversation", conversationSchema);

export default Conversation;
