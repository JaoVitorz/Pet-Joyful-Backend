import mongoose from 'mongoose';
import type {IDenunciaMessageDocument} from '../types/index.js';
import {AlvoTipo} from '../types/index.js';

const denunciaMessageSchema = new mongoose.Schema<IDenunciaMessageDocument>(
  {
    // Opcional para manter legíveis os registros antigos sem autoria comprovada.
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, immutable: true},
    nome: {type: String},
    email: {type: String, required: true},
    descricao: {type: String, required: true},
    alvoId: {type: String},
    alvoTipo: {
      type: String,
      enum: Object.values(AlvoTipo),
      default: AlvoTipo.POST,
    },
  },
  {timestamps: true},
);

const DenunciaMessage = mongoose.model<IDenunciaMessageDocument>(
  'DenunciaMessage',
  denunciaMessageSchema,
);

export default DenunciaMessage;
