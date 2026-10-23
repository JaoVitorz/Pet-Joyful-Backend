import mongoose from 'mongoose';

export interface IDirectConversationDocument extends mongoose.Document {
  participants: mongoose.Types.ObjectId[];
  participantKey: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const directConversationSchema = new mongoose.Schema<IDirectConversationDocument>(
  {
    participants: {
      type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
      required: true,
      validate: {
        validator: (participants: mongoose.Types.ObjectId[]) => participants.length === 2,
        message: 'Uma conversa deve ter exatamente dois participantes.',
      },
    },
    // A chave ordenada impede duas conversas individuais para o mesmo par.
    participantKey: {type: String, required: true, unique: true, immutable: true},
    lastMessage: {type: String, default: ''},
    lastMessageAt: {type: Date},
  },
  {timestamps: true},
);

directConversationSchema.index({participants: 1, lastMessageAt: -1});

export default mongoose.model<IDirectConversationDocument>(
  'DirectConversation',
  directConversationSchema,
);
