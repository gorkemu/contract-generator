import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import contractRoutes from './routes/contracts.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/contracts', contractRoutes);

app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL'niz
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // İzin verilen HTTP metodları
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});