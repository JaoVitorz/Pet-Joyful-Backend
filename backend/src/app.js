import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import connectDB from './src/database/connection.js';   

const app = express();
connectDB();

app.use(express.json());
app.listen(3000, () => console.log('🚀 Servidor rodando na porta 3000'));

// 🔹 Middlewares globais
app.use(cors()); // libera acesso de outros domínios (como o front em Next.js)
app.use(express.json()); // permite trabalhar com JSON no corpo das requisições

// 🔹 Rotas principais
app.use("/api", routes);

// 🔹 Rota base (teste)
app.get("/", (req, res) => {
  res.send("🚀 API Pet Joyful funcionando!");
});

export default app;
