import mongoose from 'mongoose';
import '../config/mongooseSecurity.js';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURL = process.env.MONGO_URI;

    if (!mongoURL || !mongoURL.startsWith('mongodb')) {
      console.error('❌ MONGO_URI inválida or not provided');
      throw new Error('String de conexão inválida');
    }

    await mongoose.connect(mongoURL);
    console.log('✅ messages-service conectado ao MongoDB!');
  } catch (error: unknown) {
  console.error('❌ Erro ao conectar ao MongoDB');
  process.exit(1);
  }
};

export default connectDB;
