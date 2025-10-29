import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // só o URI do Atlas
    console.log("✅ MongoDB Atlas conectado com sucesso");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB Atlas:", error.message);
    process.exit(1);
  }
};

export default connectDB;
