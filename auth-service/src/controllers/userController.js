import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// 🔹 CREATE
export const createUser = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo)
      return res.status(400).json({ error: "Todos os campos são obrigatórios!" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email já cadastrado!" });

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = new User({ nome, email, senha: hashedPassword, tipo });
    await user.save();

    res.status(201).json({ message: "Usuário criado com sucesso!", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 READ ALL
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 READ BY ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado!" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 UPDATE
export const updateUser = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;
    const updateData = { nome, email, tipo };

    // Se for alterar senha, criptografa
    if (senha) updateData.senha = await bcrypt.hash(senha, 10);

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado!" });

    res.json({ message: "Usuário atualizado com sucesso!", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 DELETE
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado!" });

    res.json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
