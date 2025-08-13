import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema.Types

const transactionSchema = new mongoose.Schema({
  source: { type: ObjectId, ref: 'Source' },
  sharedFund: { type: ObjectId, ref: 'SharedFund' },
  createdBy: { type: ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, default: 'Misc' },
  description: String,
  date: { type: Date, default: Date.now }
}, { timestamps: true })

export default mongoose.model('Transaction', transactionSchema)
