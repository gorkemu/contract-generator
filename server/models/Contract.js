import mongoose from 'mongoose';

const elementSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['title', 'paragraph']
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    required: true
  }
});

const contractSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Şablon başlığı zorunludur'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Kategori zorunludur'],
    enum: ['Gayrimenkul', 'kira', 'hizmet', 'satış', 'diğer'],
    default: 'diğer'
  },
  elements: [elementSchema], // Yeni element yapısı
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  collation: { locale: 'tr', strength: 2 }
});

// Güncelleme zamanı takibi
contractSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Contract', contractSchema);