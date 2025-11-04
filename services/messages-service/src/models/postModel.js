import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descricao: { type: String },
    imageUrl: { type: String },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
