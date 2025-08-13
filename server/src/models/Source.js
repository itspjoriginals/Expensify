import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema.Types

const sourceSchema = new mongoose.Schema({
  owner: { type: ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  color: String,
  icon: String,
  balance: { type: Number, default: 0 }
}, { timestamps: true })

sourceSchema.index({ owner: 1, name: 1 }, { unique: true })

export default mongoose.model('Source', sourceSchema)
