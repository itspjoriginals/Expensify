import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema.Types

const moneyRequestSchema = new mongoose.Schema({
  sender: { type: ObjectId, ref: 'User', required: true },
  receiver: { type: ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 1 },
  reason: String,
  status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' },
  rejectionReason: String
}, { timestamps: true })

export default mongoose.model('MoneyRequest', moneyRequestSchema)
