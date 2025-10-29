import PostMessage from "../models/postMessageModel.js";
import DenunciaMessage from "../models/denunciaMessageModel.js";

// Create a message related to a post
export const createPostMessage = async (req, res) => {
  try {
    const { nome, email, mensagem, postId } = req.body;
    if (!email || !mensagem)
      return res
        .status(400)
        .json({ error: "Email e mensagem são obrigatórios" });

    const msg = new PostMessage({ nome, email, mensagem, postId });
    await msg.save();
    return res
      .status(201)
      .json({ message: "Mensagem salva com sucesso", data: msg });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// List post messages (protected)
export const getPostMessages = async (req, res) => {
  try {
    const messages = await PostMessage.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Create a denuncia/report message
export const createDenuncia = async (req, res) => {
  try {
    const { nome, email, descricao, alvoId, alvoTipo } = req.body;
    if (!email || !descricao)
      return res
        .status(400)
        .json({ error: "Email e descrição são obrigatórios" });

    const den = new DenunciaMessage({
      nome,
      email,
      descricao,
      alvoId,
      alvoTipo,
    });
    await den.save();
    return res
      .status(201)
      .json({ message: "Denúncia registrada com sucesso", data: den });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// List denuncias (protected)
export const getDenuncias = async (req, res) => {
  try {
    const items = await DenunciaMessage.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a post message (admin only - requires API key)
export const updatePostMessage = async (req, res) => {
  try {
    // allow only API key (admin) to update messages
    if (!req.isApiKeyValid)
      return res.status(403).json({ error: "Não autorizado" });

    const { id } = req.params;
    const { nome, email, mensagem, postId } = req.body;
    const update = { nome, email, mensagem, postId };

    const updated = await PostMessage.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ error: "Mensagem não encontrada" });
    return res.json({ message: "Mensagem atualizada", data: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a post message (admin only)
export const deletePostMessage = async (req, res) => {
  try {
    if (!req.isApiKeyValid)
      return res.status(403).json({ error: "Não autorizado" });
    const { id } = req.params;
    const removed = await PostMessage.findByIdAndDelete(id);
    if (!removed)
      return res.status(404).json({ error: "Mensagem não encontrada" });
    return res.json({ message: "Mensagem deletada" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a denuncia (admin only)
export const updateDenuncia = async (req, res) => {
  try {
    if (!req.isApiKeyValid)
      return res.status(403).json({ error: "Não autorizado" });
    const { id } = req.params;
    const { nome, email, descricao, alvoId, alvoTipo } = req.body;
    const update = { nome, email, descricao, alvoId, alvoTipo };
    const updated = await DenunciaMessage.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ error: "Denúncia não encontrada" });
    return res.json({ message: "Denúncia atualizada", data: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a denuncia (admin only)
export const deleteDenuncia = async (req, res) => {
  try {
    if (!req.isApiKeyValid)
      return res.status(403).json({ error: "Não autorizado" });
    const { id } = req.params;
    const removed = await DenunciaMessage.findByIdAndDelete(id);
    if (!removed)
      return res.status(404).json({ error: "Denúncia não encontrada" });
    return res.json({ message: "Denúncia deletada" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
