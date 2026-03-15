import mongoose from 'mongoose';
import type {IPostMessageDocument} from '../types/index.js';

const postMessageSchema = new mongoose.Schema<IPostMessageDocument>(
  {
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
