import express from 'express';
import Contract from '../models/Contract.js';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Geçici: Şablonu restore etme endpointi
router.patch('/restore-template', async (req, res) => {
  try {
    const templatePath = path.join(__dirname, '../../client/src/data/templates.json');
    const templates = JSON.parse(await readFile(templatePath, 'utf-8'));
    const templateData = templates[0];
    
    const updated = await Contract.findOneAndUpdate(
      {},
      { $set: { 
        content: templateData.content, 
        variables: templateData.variables 
      }},
      { new: true }
    );
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
    content: req.body.content,
    variables: req.body.variables
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



export default router;
