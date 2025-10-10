import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./backend/src/routes/index.js";
import connectDB from "./backend/src/database/connection.js";

dotenv.config();

console.log("🔍 Variável MONGO_URI:", process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5000;

// Conecta ao banco antes de iniciar o servidor
connectDB();

app.use(cors());
app.use(express.json());

// rotas
app.use("/api", routes);

app.get('/', (req, res) => {
  res.send('🚀 Servidor e MongoDB estão rodando!');
});

// conectar Mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado 🚀"))
  .catch(err => console.error("Erro ao conectar Mongo:", err));

app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
