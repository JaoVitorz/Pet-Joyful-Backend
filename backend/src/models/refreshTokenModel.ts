import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  tokenHash: {type: String, required: true, unique: true, select: false},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, index: true},
  authVersion: {type: Number, default: 0},
  expiresAt: {type: Date, required: true, index: {expires: 0}},
  revokedAt: {type: Date, default: null},
  replacedByHash: {type: String, default: null, select: false},
  createdAt: {type: Date, default: Date.now},
}, {versionKey: false});

export default mongoose.models.RefreshToken ?? mongoose.model('RefreshToken', refreshTokenSchema);
