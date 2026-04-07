import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongoURL =
    process.env.MONGO_URI ||
    'mongodb+srv://joaojesus:oULyKDlXfS0Stg4M@cluster0.hmlyx3e.mongodb.net/?appName=Cluster0';

  if (!mongoURL.startsWith('mongodb')) {
    throw new Error(`MONGO_URI inválida: ${mongoURL}`);
  }

  await mongoose.connect(mongoURL);
  console.log('✅ Conectado ao MongoDB!');
};

export default connectDB;
