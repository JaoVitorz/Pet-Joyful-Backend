import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  tipo: { type: String, enum: ["adotante", "ong", "veterinario"], required: true }
}, { timestamps: true });

// Hash da senha antes de salvar (somente se modificada)
userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('senha')) return next();
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar senha informada com a senha armazenada
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.senha);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
