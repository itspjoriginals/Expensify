import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import Notification from '../models/Notification.js'

const router = Router()

router.get('/', auth, async (req, res) => {
  const list = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100)
  res.json(list)
})

router.patch('/:id/read', auth, async (req, res) => {
  await Notification.updateOne({ _id: req.params.id, user: req.user._id }, { $set: { read: true } })
  res.json({ ok: true })
})

export default router
