import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/petjoyful";
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conectado ao MongoDB!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
