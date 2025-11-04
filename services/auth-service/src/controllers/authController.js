import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const nome = req.body.nome || req.body.name;
    const email = req.body.email;
    const senha = req.body.senha || req.body.password;
    const tipo = req.body.tipo || req.body.type;

    if (!nome || !email || !senha || !tipo) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios!" });
    }

    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "Email já está em uso" });
    }

    user = new userModel({ nome, email, senha, tipo });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Usuário criado com sucesso",
      token: `Bearer ${token}`,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
      },
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const email = req.body.email;
    const senha = req.body.senha || req.body.password;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const user = await userModel.findOne({ email });
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

    const senhaCorreta = await user.comparePassword(senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token: `Bearer ${token}`,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Não autenticado" });

    const user = await userModel.findById(userId).select("-senha");
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    return res.json({ user });
  } catch (error) {
    console.error("Erro em getProfile:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Não autenticado" });

    const { nome, email, senha, tipo } = req.body;

    const updateData = {};
    if (nome) updateData.nome = nome;
    if (email) updateData.email = email;
    if (tipo) updateData.tipo = tipo;
    if (senha) updateData.senha = await bcrypt.hash(senha, 10);

    if (email) {
      const other = await userModel.findOne({ email });
      if (other && other._id.toString() !== userId.toString()) {
        return res
          .status(400)
          .json({ error: "Email já em uso por outro usuário" });
      }
    }

    const user = await userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select("-senha");
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    return res.json({ message: "Perfil atualizado com sucesso", user });
  } catch (error) {
    console.error("Erro em updateProfile:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Não autenticado" });

    const user = await userModel.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    return res.json({ message: "Conta deletada com sucesso" });
  } catch (error) {
    console.error("Erro em deleteProfile:", error);
    return res.status(500).json({ error: error.message });
  }
};
