import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import type {IUserDocument} from '../types/index.js';
import {UserTipo} from '../types/index.js';

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    nome: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    senha: {type: String, required: true},
    tipo: {
      type: String,
      enum: Object.values(UserTipo),
      required: true,
    },
  },
  {timestamps: true},
);

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
