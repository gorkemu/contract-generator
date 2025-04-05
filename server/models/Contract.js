import mongoose from 'mongoose';

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
    enum: ['Gayrimenkul', 'kira', 'hizmet', 'satış', 'diğer'], // Gayrimenkul eklendi
    default: 'diğer'
  },
  content: {
    type: String,
    required: [true, 'Şablon içeriği zorunludur']
  },
  variables: {  // Array yerine Object olarak değiştirildi
    type: Object,
    default: {}
  },
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

contractSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Contract', contractSchema);