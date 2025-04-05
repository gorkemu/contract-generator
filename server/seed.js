import mongoose from 'mongoose';
import Contract from './models/Contract.js';
import { readFile } from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    const DB_URI = process.env.MONGODB_URI.replace(
      '<password>',
      process.env.MONGODB_PASSWORD
    );
    
    await mongoose.connect(DB_URI);
    console.log('MongoDB Atlas bağlantısı başarılı');

    const templates = JSON.parse(
      await readFile(
        new URL('../client/src/data/templates.json', import.meta.url)
      )
    );

    // Sadece contracts koleksiyonunu temizle
    await Contract.deleteMany({});
    console.log('Contracts koleksiyonu temizlendi.');

    const insertedContracts = await Contract.insertMany(templates);
    console.log(`${insertedContracts.length} sözleşme şablonu eklendi.`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err);
    process.exit(1);
  }
};

seedDatabase();