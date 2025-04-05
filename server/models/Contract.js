import mongoose from 'mongoose';

const ContractSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  variables: { type: Map, of: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { versionKey: false });

const Contract = mongoose.model('Contract', ContractSchema);
export default Contract;