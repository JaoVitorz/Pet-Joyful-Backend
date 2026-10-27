import mongoose from 'mongoose';
import './mongooseSecurity.js';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ MongoDB Atlas conectado com sucesso, Muito bem!!!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB Atlas');
    process.exit(1);
  }
};

export default connectDB;
