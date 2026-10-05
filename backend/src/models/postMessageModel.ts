import mongoose from 'mongoose';
import type {IPostMessageDocument} from '../types/index.js';

const postMessageSchema = new mongoose.Schema<IPostMessageDocument>(
  {
    // Opcional para manter legíveis os registros antigos sem autoria comprovada.
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, immutable: true},
    nome: {type: String},
    email: {type: String, required: true},
    mensagem: {type: String, required: true},
    postId: {type: String},
  },
  {timestamps: true},
);

const PostMessage = mongoose.model<IPostMessageDocument>(
  'PostMessage',
  postMessageSchema,
);

export default PostMessage;
