import mongoose from 'mongoose';

export interface IPost {
  titulo: string;
  descricao?: string;
  imageUrl?: string | null;
  publishedAt?: Date;
}

const postSchema = new mongoose.Schema<IPost>(
  {
    titulo: { type: String, required: true },
    descricao: { type: String },
    imageUrl: { type: String },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Post = mongoose.model('Post', postSchema);

export default Post;
