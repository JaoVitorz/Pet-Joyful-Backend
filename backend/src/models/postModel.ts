import mongoose from 'mongoose';

export interface IPostDocument extends mongoose.Document {
  userId?: mongoose.Types.ObjectId;
  titulo: string;
  descricao?: string;
  imageUrl?: string | null;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mesmo nome de coleção do serviço de posts, usando a conexão do backend principal.
const postSchema = new mongoose.Schema<IPostDocument>({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true},
  titulo: {type: String, required: true},
  descricao: String,
  imageUrl: String,
  publishedAt: Date,
}, {timestamps: true, collection: 'posts'});

export default mongoose.model<IPostDocument>('Post', postSchema);
