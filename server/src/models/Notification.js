import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema.Types

const notificationSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: 'User', required: true },
  title: String,
  message: String,
  read: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('Notification', notificationSchema)
