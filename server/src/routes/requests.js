import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import MoneyRequest from '../models/MoneyRequest.js'
import Notification from '../models/Notification.js'
import Source from '../models/Source.js'
import Transaction from '../models/Transaction.js'
import User from '../models/User.js'

const router = Router()

// Send a request (sender -> receiver)
router.post('/', auth, async (req, res) => {
  const { toEmail, amount, reason } = req.body
  const receiver = await User.findOne({ email: toEmail })
  if (!receiver) return res.status(404).json({ error: 'Receiver not found' })
  const doc = await MoneyRequest.create({ sender: req.user._id, receiver: receiver._id, amount, reason })
  await Notification.create({ user: receiver._id, title: 'New Money Request', message: `${req.user.name} requested ₹${amount}: ${reason}` })
  res.json(doc)
})

// Get my inbox/outbox
router.get('/', auth, async (req, res) => {
  const inbox = await MoneyRequest.find({ receiver: req.user._id }).populate('sender','name email').sort({ createdAt: -1 })
  const outbox = await MoneyRequest.find({ sender: req.user._id }).populate('receiver','name email').sort({ createdAt: -1 })
  res.json({ inbox, outbox })
})

// Accept
router.patch('/:id/accept', auth, async (req, res) => {
  const doc = await MoneyRequest.findById(req.params.id).populate('sender receiver')
  if (!doc || String(doc.receiver._id) != String(req.user._id)) return res.status(404).json({ error: 'Request not found' })
  if (doc.status !== 'pending') return res.status(400).json({ error: 'Already handled' })

  // Ensure a Source for the sender exists under receiver's ownership
  const sourceName = doc.sender.name
  let source = await Source.findOne({ owner: req.user._id, name: sourceName })
  if (!source) source = await Source.create({ owner: req.user._id, name: sourceName, balance: 0 })

  // Record income and update balance
  await Transaction.create({
    source: source._id,
    createdBy: req.user._id,
    type: 'income',
    amount: doc.amount,
    category: 'Request Accepted',
    description: doc.reason
  })
  source.balance += doc.amount
  await source.save()

  doc.status = 'accepted'
  await doc.save()

  await Notification.create({ user: doc.sender._id, title: 'Request Accepted', message: `${doc.receiver.name} accepted ₹${doc.amount}` })
  res.json({ ok: true })
})

// Reject
router.patch('/:id/reject', auth, async (req, res) => {
  const { rejectionReason } = req.body
  const doc = await MoneyRequest.findById(req.params.id).populate('sender receiver')
  if (!doc || String(doc.receiver._id) != String(req.user._id)) return res.status(404).json({ error: 'Request not found' })
  if (doc.status !== 'pending') return res.status(400).json({ error: 'Already handled' })

  doc.status = 'rejected'
  doc.rejectionReason = rejectionReason || 'No reason provided'
  await doc.save()

  await Notification.create({ user: doc.sender._id, title: 'Request Rejected', message: `${doc.receiver.name} rejected: ${doc.rejectionReason}` })
  res.json({ ok: true })
})

export default router
