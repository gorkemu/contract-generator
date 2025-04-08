// server\routes\contracts.js
import express from 'express';
import Contract from '../models/Contract.js';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const contracts = await Contract.find();
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const contract = new Contract({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category || 'diğer',
    elements: req.body.elements || []
  });

  try {
    const newContract = await contract.save();
    res.status(201).json(newContract);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedContract = await Contract.findByIdAndDelete(req.params.id);
    if (!deletedContract) {
      return res.status(404).json({ message: 'Sözleşme bulunamadı' });
    }
    res.json({ message: 'Sözleşme silindi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const updateData = {
      updatedAt: Date.now()
    };
    
    // İsteğe bağlı alanları kontrol et ve ekle
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.category) updateData.category = req.body.category;
    if (req.body.elements) updateData.elements = req.body.elements;
    
    const updatedContract = await Contract.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    
    if (!updatedContract) {
      return res.status(404).json({ message: 'Sözleşme bulunamadı' });
    }
    res.json(updatedContract);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;