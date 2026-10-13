import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import type {IUserDocument} from '../types/index.js';
import {UserTipo} from '../types/index.js';

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    nome: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    cpf: {type: String, unique: true, sparse: true, select: false},
    deletionRequestedAt: {type: Date, select: false},
    senha: {type: String, required: true},
    mfaEnabled: {type: Boolean, default: false},
    mfaSecret: {type: String, select: false},
    mfaPendingSecret: {type: String, select: false},
    mfaPendingExpiresAt: {type: Date, select: false},
    mfaLastUsedStep: {type: Number, select: false},
    mfaRecoveryCodes: {type: [String], select: false, default: []},
    mfaChallengeNonce: {type: String, select: false},
    mfaFailedAttempts: {type: Number, select: false, default: 0},
    mfaLockedUntil: {type: Date, select: false},
    authVersion: {type: Number, default: 0},
    tipo: {
      type: String,
      enum: Object.values(UserTipo),
      required: true,
    },
  },
  {timestamps: true},
);

userSchema.set('toJSON', {
  transform: (_document, result) => {
    const safe = result as unknown as Record<string, unknown>;
    for (const key of ['senha', 'cpf', 'mfaSecret', 'mfaPendingSecret',
      'mfaPendingExpiresAt', 'mfaLastUsedStep', 'mfaRecoveryCodes',
      'mfaChallengeNonce', 'mfaFailedAttempts', 'mfaLockedUntil']) {
      delete safe[key];
    }
    return result;
  },
});

// Hash da senha antes de salvar (somente se modificada)
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('senha')) return next();
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Método para comparar senha informada com a senha armazenada
userSchema.methods.comparePassword = function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.senha as string);
};

const userModel = mongoose.model<IUserDocument>('User', userSchema);

export default userModel;
