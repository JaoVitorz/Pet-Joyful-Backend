import Post from "../models/postModel.js";

export const createPost = async (req, res) => {
  try {
    const { titulo, descricao } = req.body;
    if (!titulo) return res.status(400).json({ error: "Título é obrigatório" });

    const file = req.file;
    const imageUrl = file ? `/uploads/${file.filename}` : null;

    const post = new Post({ titulo, descricao, imageUrl, publishedAt: new Date() });
    await post.save();

    return res.status(201).json({ message: "Post criado com sucesso", post });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default { createPost };
