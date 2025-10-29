import Pet from "../models/petModel.js";
import axios from "axios";

// CREATE Pet
export const createPet = async (req, res) => {
  try {
    const { name, species, breed, age, weight, color, ownerId, description, imageUrl } = req.body;

    if (!name || !species || !ownerId) {
      return res.status(400).json({ error: "Nome, espécie e ownerId são obrigatórios!" });
    }

    // Opcional: Verificar se o ownerId existe no auth-service
    try {
      const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://auth-service:5000";
      await axios.get(`${authServiceUrl}/api/users/${ownerId}`, {
        headers: { 'x-api-key': process.env.API_KEY }
      });
    } catch (error) {
      return res.status(404).json({ error: "Proprietário não encontrado no Auth Service" });
    }

    const pet = new Pet({ name, species, breed, age, weight, color, ownerId, description, imageUrl });
    await pet.save();

    res.status(201).json({ message: "Pet criado com sucesso!", pet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ ALL Pets
export const getPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ Pet BY ID
export const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: "Pet não encontrado!" });
    }
    res.json(pet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ Pets BY OWNER
export const getPetsByOwner = async (req, res) => {
  try {
    const pets = await Pet.find({ ownerId: req.params.ownerId });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE Pet
export const updatePet = async (req, res) => {
  try {
    const { name, species, breed, age, weight, color, status, description, imageUrl } = req.body;
    const updateData = { name, species, breed, age, weight, color, status, description, imageUrl };

    const pet = await Pet.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!pet) {
      return res.status(404).json({ error: "Pet não encontrado!" });
    }

    res.json({ message: "Pet atualizado com sucesso!", pet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE Pet
export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: "Pet não encontrado!" });
    }
    res.json({ message: "Pet deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};