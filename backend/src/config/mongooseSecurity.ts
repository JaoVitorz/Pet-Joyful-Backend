import mongoose from 'mongoose';

// Mongoose escapa objetos de filtro que contenham operadores recebidos do cliente.
mongoose.set('sanitizeFilter', true);

export default mongoose;
