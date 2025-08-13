import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import SharedFund from '../models/SharedFund.js'
import User from '../models/User.js'
import Notification from '../models/Notification.js'
import Transaction from '../models/Transaction.js'

const router = Router()

// Create a fund and add contributors by email
router.post('/', auth, async (req, res) => {
  const { name, totalAmount, contributorEmails = [] } = req.body
  const contributors = []
  for (const email of contributorEmails) {
    const u = await User.findOne({ email })
    if (u) contributors.push(u._id)
  }
  // Always include owner as contributor for permissions
  const fund = await SharedFund.create({
    owner: req.user._id,
    name,
    totalAmount,
    remainingAmount: totalAmount,
    contributors: Array.from(new Set([req.user._id, ...contributors]))
  })
  // Notify contributors (excluding owner if present twice)
  for (const uid of fund.contributors) {
    if (String(uid) !== String(req.user._id)) {
      await Notification.create({ user: uid, title: 'Added to Shared Fund', message: `${req.user.name} added you to fund "${name}"` })
    }
  }
  res.json(fund)
})

// List funds I own or contribute to
router.get('/', auth, async (req, res) => {
  const myId = req.user._id
  const funds = await SharedFund.find({ $or: [{ owner: myId }, { contributors: myId }] }).sort({ createdAt: -1 })
  res.json(funds)
})

// Add an expense to a shared fund
router.post('/:id/expenses', auth, async (req, res) => {
  const { amount, category = 'Shared', description = '' } = req.body
  const fund = await SharedFund.findById(req.params.id)
  if (!fund) return res.status(404).json({ error: 'Fund not found' })
  const isMember = String(fund.owner) === String(req.user._id) || fund.contributors.some(id => String(id) === String(req.user._id))
  if (!isMember) return res.status(403).json({ error: 'Not a contributor' })
  if (amount > fund.remainingAmount) return res.status(400).json({ error: 'Insufficient fund balance' })

  await Transaction.create({
    sharedFund: fund._id,
    createdBy: req.user._id,
    type: 'expense',
    amount,
    category,
    description
  })
  fund.remainingAmount -= amount
  await fund.save()

  // Notify others
  const notifyList = new Set([String(fund.owner), ...fund.contributors.map(x => String(x))])
  notifyList.delete(String(req.user._id))
  for (const uid of notifyList) {
    await Notification.create({ user: uid, title: 'Shared Fund Expense', message: `${req.user.name} spent ₹${amount} on "${fund.name}"` })
  }
  res.json({ ok: true, remainingAmount: fund.remainingAmount })
})

export default router
