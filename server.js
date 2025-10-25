import dotenv from "dotenv";
import connectDB from "./backend/src/database/connection.js";
import app from "./backend/src/app.js";
import userModel from "./backend/src/models/userModel.js";
import bcrypt from "bcryptjs";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Conecta ao MongoDB primeiro
connectDB().then(() => {
  // Rota de teste para criar usuário (mantida aqui para testes rápidos)
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

  app.listen(PORT, "0.0.0.0", () => console.log(`✅ Servidor rodando na porta ${PORT}`));
}).catch(err => {
  console.error('Falha ao conectar ao banco, servidor não iniciado:', err);
});
