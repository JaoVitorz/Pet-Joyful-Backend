import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async (): Promise<void> => {
  const mongoURL = process.env.MONGO_URI;

  if (!mongoURL) {
    throw new Error('MONGO_URI não definida');
  }

  await mongoose.connect(mongoURL);
  console.log('✅ Conectado ao MongoDB!');
};

export default connectDB;