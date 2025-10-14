import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  tipo: { type: String, enum: ["adotante", "ong", "veterinario"], required: true }
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);

export default userModel;
