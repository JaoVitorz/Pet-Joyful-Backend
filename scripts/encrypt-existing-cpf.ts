import 'dotenv/config';
import mongoose from 'mongoose';
import '../backend/src/config/mongooseSecurity.js';
import User from '../backend/src/models/userModel.js';
import {cpfLookupHash, decryptCpf, encryptCpf} from '../backend/src/services/cpfProtection.js';

if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required');
await mongoose.connect(process.env.MONGO_URI);
try {
  const users = await User.find({cpf: mongoose.trusted({$exists: true, $ne: null})}).select('+cpf +cpfHash');
  let migrated = 0;
  for (const user of users) {
    if (!user.cpf) continue;
    const cpf = user.cpf.startsWith('v1.') ? decryptCpf(user.cpf) : user.cpf;
    const encrypted = user.cpf.startsWith('v1.') ? user.cpf : encryptCpf(cpf);
    await User.updateOne({_id: user._id}, {$set: {cpf: encrypted, cpfHash: cpfLookupHash(cpf)}}, {runValidators: true});
    migrated += 1;
  }
  console.log(`CPF records encrypted: ${migrated}`);
} finally {
  await mongoose.disconnect();
}
