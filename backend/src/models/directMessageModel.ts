import mongoose from 'mongoose';

export interface IDirectMessageDocument extends mongoose.Document {
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  text: string;
  readBy: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const directMessageSchema = new mongoose.Schema<IDirectMessageDocument>(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DirectConversation',
      required: true,
      index: true,
      immutable: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
      immutable: true,
    },
    text: {type: String, required: true, trim: true, maxlength: 2000},
    readBy: {type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], default: []},
  },
  {timestamps: true},
);

directMessageSchema.index({conversationId: 1, createdAt: 1});
directMessageSchema.index({conversationId: 1, senderId: 1, readBy: 1});

export default mongoose.model<IDirectMessageDocument>(
  'DirectMessage',
  directMessageSchema,
);
