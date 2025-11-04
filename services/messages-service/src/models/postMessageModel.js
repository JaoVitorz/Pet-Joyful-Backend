import mongoose from "mongoose";

const postMessageSchema = new mongoose.Schema(
  {
    nome: { type: String },
    email: { type: String, required: true },
    mensagem: { type: String, required: true },
    postId: { type: String },
  },
  { timestamps: true }
);

const PostMessage = mongoose.model("PostMessage", postMessageSchema);

export default PostMessage;
