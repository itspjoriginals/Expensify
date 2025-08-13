import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema.Types

const sharedFundSchema = new mongoose.Schema({
  owner: { type: ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  totalAmount: { type: Number, required: true, min: 0 },
  remainingAmount: { type: Number, required: true, min: 0 },
  contributors: [{ type: ObjectId, ref: 'User' }]
}, { timestamps: true })

sharedFundSchema.index({ owner: 1, name: 1 }, { unique: true })

export default mongoose.model('SharedFund', sharedFundSchema)
