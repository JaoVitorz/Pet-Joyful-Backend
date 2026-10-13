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
  { timestamps: true, collection: 'posts' },
);

// Nome distinto do modelo usado pelo backend principal, mesmo quando os testes
// resolvem as duas importações para a mesma instância do Mongoose.
const Post = mongoose.model<IPost>('ServicePost', postSchema);

export default Post;
