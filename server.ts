import 'dotenv/config';
import connectDB from './backend/src/database/connection.js';
import app from './backend/src/app.js';
import bcrypt from 'bcryptjs';
import userModel from './backend/src/models/userModel.js';
import type {Request, Response} from 'express';

const PORT = process.env.PORT || 5000;

// Rota de teste para criar usuário (mantida para testes rápidos)
app.post('/test-user', async (req: Request, res: Response) => {
  try {
    const {nome, email, senha, tipo} = req.body as {
      nome: string;
      email: string;
      senha: string;
      tipo: string;
    };

    if (!nome || !email || !senha || !tipo) {
      res.status(400).json({error: 'Todos os campos são obrigatórios!'});
      return;
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const newUser = new userModel({nome, email, senha: hashedPassword, tipo});
    await newUser.save();
    res.status(201).json({message: 'Usuário criado com sucesso!', user: newUser});
  } catch (error) {
    res.status(400).json({error: (error as Error).message});
  }
});

app.listen(Number(PORT), '0.0.0.0', () =>
  console.log(`✅ Servidor rodando na porta ${PORT}`),
);

connectDB()
  .then(() => {
    console.log('✅ Banco conectado com sucesso');
  })
  .catch((error: unknown) => {
    console.error(
      '⚠️ Banco indisponível. API iniciada sem conexão com MongoDB:',
      (error as Error).message,
    );
  });
