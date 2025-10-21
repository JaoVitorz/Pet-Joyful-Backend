import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./backend/src/database/connection.js";
import routes from "./backend/src/routes/index.js";
import userModel from "./backend/src/models/userModel.js";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conecta ao MongoDB
connectDB();

// Rotas principais
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("🚀 Backend PetJoyful rodando com Docker e MongoDB!");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Rota de teste para criar usuário
app.post("/test-user", async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = new userModel({
      nome,
      email,
      senha: hashedPassword,
      tipo,
    });

    await newUser.save();
    res.status(201).json({ message: "Usuário criado com sucesso!", user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`✅ Servidor rodando na porta ${PORT}`)
);
