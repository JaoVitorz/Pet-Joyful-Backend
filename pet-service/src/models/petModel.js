import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true, enum: ["dog", "cat", "bird", "other"] },
  breed: { type: String },
  age: { type: Number, min: 0 },
  weight: { type: Number, min: 0 },
  color: { type: String },
  ownerId: { type: String, required: true }, // ID do usuário do auth-service
  status: { type: String, enum: ["available", "adopted"], default: "available" },
  description: { type: String },
  imageUrl: { type: String }
}, { timestamps: true });

const Pet = mongoose.model("Pet", petSchema);

export default Pet;