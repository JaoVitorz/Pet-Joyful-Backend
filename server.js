import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./backend/src/database/connection.js"; // conexão centralizada
import routes from "./backend/src/routes/index.js";
import userModel from "./backend/src/models/userModel.js";
import bcrypt from "bcryptjs";

// Carregar variáveis de ambiente **antes de usar**
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Conecta ao MongoDB usando conexão centralizada
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas principais
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("🚀 Servidor e MongoDB estão rodando!");
});

// Rota de teste: criar usuário
app.post('/test-user', async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = new userModel({
      nome,
      email,
      senha: hashedPassword,
      tipo
    });

    await newUser.save();
    console.log("✅ Usuário salvo no banco:", newUser);

    res.status(201).json({ message: 'Usuário criado com sucesso!', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
