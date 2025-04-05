import express from 'express';
import Contract from '../models/Contract.js';

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

export default router;