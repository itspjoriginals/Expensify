import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import Transaction from '../models/Transaction.js'
import Source from '../models/Source.js'

const router = Router()

router.get('/', auth, async (req, res) => {
  const { limit = 50 } = req.query
  const tx = await Transaction.find({ createdBy: req.user._id })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .populate('source sharedFund', 'name')
  res.json(tx)
})

router.post('/', auth, async (req, res) => {
  try {
    const { sourceId, type, amount, category, description, date } = req.body
    let source = null
    if (sourceId) source = await Source.findOne({ _id: sourceId, owner: req.user._id })
    const tx = await Transaction.create({
      source: source?._id,
      createdBy: req.user._id,
      type, amount, category, description, date
    })
    if (source) {
      source.balance += type === 'income' ? amount : -amount
      await source.save()
    }
    res.json(tx)
  } catch (e) {
    res.status(400).json({ error: 'Transaction failed' })
  }
})

export default router
