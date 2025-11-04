import mongoose from "mongoose";

const denunciaMessageSchema = new mongoose.Schema(
  {
    nome: { type: String },
    email: { type: String, required: true },
    descricao: { type: String, required: true },
    alvoId: { type: String },
    alvoTipo: {
      type: String,
      enum: ["post", "usuario", "outro"],
      default: "post",
    },
  },
  { timestamps: true }
);

const DenunciaMessage = mongoose.model(
  "DenunciaMessage",
  denunciaMessageSchema
);

export default DenunciaMessage;
