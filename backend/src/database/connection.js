import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURL =
      process.env.MONGO_URI ||
      "mongodb+srv://joaojesus:oULyKDlXfS0Stg4M@cluster0.hmlyx3e.mongodb.net/?appName=Cluster0";

    if (!mongoURL.startsWith("mongodb")) {
      console.error("❌ MONGO_URI inválida:", mongoURL);
      throw new Error("String de conexão inválida");
    }

    await mongoose.connect(mongoURL);
    console.log("✅ Conectado ao MongoDB!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
