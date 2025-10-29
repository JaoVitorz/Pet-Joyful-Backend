import mongoose from "mongoose";

// Cache de conexão para Vercel serverless
let cachedConnection = null;

const connectDB = async () => {
  // Se já existe conexão ativa, retorna ela
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('✅ Usando conexão MongoDB em cache');
    return cachedConnection;
  }

  try {
    const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/petjoyful";
    
    // Configurações otimizadas para Vercel serverless
    const options = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log('🔄 Conectando ao MongoDB...');
    
    const connection = await mongoose.connect(mongoURL, options);
    
    cachedConnection = connection;
    
    console.log(`✅ Conectado ao MongoDB: ${connection.connection.host}`);
    
    return connection;
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error.message);
    cachedConnection = null;
    throw error;
  }
};

export default connectDB;