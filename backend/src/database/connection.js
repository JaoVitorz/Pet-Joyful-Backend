import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Prefer MONGO_URI (matches .env), fall back to MONGO_URL for compatibility,
    // and finally use a local default.
    const mongoURL =
      process.env.MONGO_URI ||
      process.env.MONGO_URL ||
      "mongodb://localhost:27017/petjoyful";
    // Mongoose v6+ uses the new URL parser and unified topology by default.
    // Passing `useNewUrlParser` and `useUnifiedTopology` is deprecated and
    // will cause driver warnings, so call connect without those options.
    await mongoose.connect(mongoURL);
    console.log("✅ Conectado ao MongoDB!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
