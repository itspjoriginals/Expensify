import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import Source from '../models/Source.js'

const router = Router()

router.get('/', auth, async (req, res) => {
  const list = await Source.find({ owner: req.user._id }).sort({ createdAt: -1 })
  res.json(list)
})

router.post('/', auth, async (req, res) => {
  const { name, color, icon, initialBalance } = req.body
  try {
    const src = await Source.create({ owner: req.user._id, name, color, icon, balance: initialBalance || 0 })
    res.json(src)
  } catch (e) {
    res.status(400).json({ error: 'Source create failed (maybe duplicate name)' })
  }
})

export default router
