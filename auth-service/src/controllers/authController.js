
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const register = async (req, res) => {
  try {
    // Aceita ambos os formatos: português (nome, senha, tipo) e inglês (name, password, type)
    const nome = req.body.nome || req.body.name;
    const email = req.body.email;
    const senha = req.body.senha || req.body.password;
    const tipo = req.body.tipo || req.body.type;

    // Validar campos obrigatórios
    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }

    // Verificar se usuário já existe
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    // Criar novo usuário (a senha será hasheada pelo middleware pre-save)
    user = new userModel({ nome, email, senha, tipo });
    await user.save();

    return res.status(201).json({ message: 'Usuário criado com sucesso', user });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    // Aceita both password and senha
    const email = req.body.email;
    const senha = req.body.senha || req.body.password;

    // Validar campos obrigatórios
    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    // Buscar usuário
    console.log('Tentando login com email:', email);
    const user = await userModel.findOne({ email });
    
    if (!user) {
      console.log('Usuário não encontrado com email:', email);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    console.log('Usuário encontrado:', { email: user.email, tipo: user.tipo });
    
    // Verificar senha
    const senhaCorreta = await user.comparePassword(senha);
    console.log('Resultado da comparação de senha:', senhaCorreta);
    
    if (!senhaCorreta) {
      console.log('Senha incorreta para o usuário:', email);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: error.message });
  }
};
