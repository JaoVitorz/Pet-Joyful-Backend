import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./backend/src/database/connection.js"; // conexão centralizada
import routes from "./backend/src/routes/index.js";
import userModel from "./backend/src/models/userModel.js";
import bcrypt from "bcryptjs";

// 🔹 Carrega variáveis de ambiente antes de tudo
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 Verifica se MONGO_URI existe
if (!process.env.MONGO_URI) {
  console.error("❌ ERRO: A variável MONGO_URI não está definida no arquivo .env!");
  process.exit(1);
}

// 🔹 Conecta ao MongoDB
connectDB();

// 🔹 Middlewares globais
app.use(cors());
app.use(express.json());

// 🔹 Rotas principais da API
app.use("/api", routes);

// 🔹 Rota principal de teste
app.get("/", (req, res) => {
  res.status(200).send("🚀 Servidor e MongoDB estão rodando corretamente!");
});

// 🔹 Rota de teste para criação de usuário direto (bypass do controller)
app.post("/test-user", async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email já cadastrado!" });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = new userModel({
      nome,
      email,
      senha: hashedPassword,
      tipo,
    });

    await newUser.save();
    console.log("✅ Usuário salvo no banco:", newUser);

    res.status(201).json({
      message: "Usuário criado com sucesso!",
      user: newUser,
    });
  } catch (error) {
    console.error("❌ Erro ao criar usuário:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// 🔹 Middleware global para tratar rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada!" });
});

// 🔹 Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
    