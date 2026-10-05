import mongoose from 'mongoose';

export interface IPost {
  createdAt?: Date;
  updatedAt?: Date;
  userId?: mongoose.Types.ObjectId;
  titulo: string;
  descricao?: string;
  imageUrl?: string | null;
  publishedAt?: Date;
}

const postSchema = new mongoose.Schema<IPost>(
  {
    // Os posts anteriores permanecem sem autoria atribuída.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, immutable: true },
    titulo: { type: String, required: true },
    descricao: { type: String },
    imageUrl: { type: String },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Post = mongoose.model('Post', postSchema);

export default Post;
