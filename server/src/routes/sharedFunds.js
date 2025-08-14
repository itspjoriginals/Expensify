// import { Router } from 'express'
// import { auth } from '../middleware/auth.js'
// import SharedFund from '../models/SharedFund.js'
// import User from '../models/User.js'
// import Notification from '../models/Notification.js'
// import Transaction from '../models/Transaction.js'
// import Source from '../models/Source.js'

// const router = Router()

// // Create a fund and add contributors by email
// router.post('/', auth, async (req, res) => {
//   const { name, totalAmount, contributorEmails = [] } = req.body
//   const contributors = []
//   let notFoundEmails = []
//   for (const email of contributorEmails) {
//     const u = await User.findOne({ email })
//     if (u) contributors.push(u._id)
//     else notFoundEmails.push(email)
//   }
//   if (notFoundEmails.length > 0) {
//     return res.status(400).json({ error: 'User(s) not found', notFound: notFoundEmails })
//   }
//   // Always include owner as contributor for permissions
//   const fund = await SharedFund.create({
//     owner: req.user._id,
//     name,
//     totalAmount,
//     remainingAmount: totalAmount,
//     contributors: Array.from(new Set([req.user._id, ...contributors]))
//   })
//   // Notify contributors (excluding owner if present twice)
//   for (const uid of fund.contributors) {
//     if (String(uid) !== String(req.user._id)) {
//       await Notification.create({ user: uid, title: 'Added to Shared Fund', message: `${req.user.name} added you to fund "${name}"` })
//     }
//   }
//   res.json(fund)
// })

// // List funds I own or contribute to
// router.get('/', auth, async (req, res) => {
//   const myId = req.user._id
//   const funds = await SharedFund.find({ $or: [{ owner: myId }, { contributors: myId }] }).sort({ createdAt: -1 })
//   res.json(funds)
// })

// // Add an expense to a shared fund
// router.post('/:id/expenses', auth, async (req, res) => {
//   const { amount, category = 'Shared', description = '' } = req.body
//   const fund = await SharedFund.findById(req.params.id)
//   if (!fund) return res.status(404).json({ error: 'Fund not found' })
//   const isMember = String(fund.owner) === String(req.user._id) || fund.contributors.some(id => String(id) === String(req.user._id))
//   if (!isMember) return res.status(403).json({ error: 'Not a contributor' })
//   if (amount > fund.remainingAmount) return res.status(400).json({ error: 'Insufficient fund balance' })

//   await Transaction.create({
//     sharedFund: fund._id,
//     createdBy: req.user._id,
//     type: 'expense',
//     amount,
//     category,
//     description
//   })
//   fund.remainingAmount -= amount
//   await fund.save()

//   // Deduct from contributor's Source balance
//   const source = await Source.findOne({ owner: req.user._id, name: req.user.name })
//   if (source) {
//     source.balance = Math.max(0, source.balance - amount)
//     await source.save()
//   }

//   // Notify others
//   const notifyList = new Set([String(fund.owner), ...fund.contributors.map(x => String(x))])
//   notifyList.delete(String(req.user._id))
//   for (const uid of notifyList) {
//     await Notification.create({ user: uid, title: 'Shared Fund Expense', message: `${req.user.name} spent ₹${amount} on "${fund.name}"` })
//   }
//   res.json({ ok: true, remainingAmount: fund.remainingAmount })
// })

// export default router





import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import SharedFund from '../models/SharedFund.js'
import User from '../models/User.js'
import Notification from '../models/Notification.js'
import Transaction from '../models/Transaction.js'
import Source from '../models/Source.js'

const router = Router()

/**
 * Create a fund and add contributors by email
 * Requires: name, totalAmount, optional contributorEmails[], optional sourceId
 */
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      totalAmount,
      contributorEmails = [],
      sourceId = null
    } = req.body

    const contributors = []
    let notFoundEmails = []

    // Validate contributor emails
    for (const email of contributorEmails) {
      const u = await User.findOne({ email })
      if (u) contributors.push(u._id)
      else notFoundEmails.push(email)
    }

    if (notFoundEmails.length > 0) {
      return res.status(400).json({
        error: 'User(s) not found',
        notFound: notFoundEmails
      })
    }

    // Always include owner as contributor for permissions
    const fund = await SharedFund.create({
      owner: req.user._id,
      name,
      totalAmount,
      remainingAmount: totalAmount,
      source: sourceId || null, // ✅ Store sourceId if provided
      contributors: Array.from(new Set([req.user._id, ...contributors]))
    })

    // Notify contributors (excluding self)
    for (const uid of fund.contributors) {
      if (String(uid) !== String(req.user._id)) {
        await Notification.create({
          user: uid,
          title: 'Added to Shared Fund',
          message: `${req.user.name} added you to fund "${name}"`
        })
      }
    }

    res.json(fund)
  } catch (err) {
    console.error('Contributor Email not found in Database! Try Again:', err)
    res.status(500).json({ error: 'Server error creating fund' })
  }
})

/**
 * List funds I own or contribute to
 */
router.get('/', auth, async (req, res) => {
  try {
    const myId = req.user._id
    const funds = await SharedFund.find({
      $or: [{ owner: myId }, { contributors: myId }]
    }).sort({ createdAt: -1 })

    res.json(funds)
  } catch (err) {
    console.error('Error fetching funds:', err)
    res.status(500).json({ error: 'Server error fetching funds' })
  }
})

/**
 * Add an expense to a shared fund
 */
router.post('/:id/expenses', auth, async (req, res) => {
  try {
    const { amount, category = 'Shared', description = '' } = req.body
    const fund = await SharedFund.findById(req.params.id)

    if (!fund) {
      return res.status(404).json({ error: 'Fund not found' })
    }

    // Permission check
    const isMember =
      String(fund.owner) === String(req.user._id) ||
      fund.contributors.some(id => String(id) === String(req.user._id))

    if (!isMember) {
      return res.status(403).json({ error: 'Not a contributor' })
    }

    // Balance check
    if (amount > fund.remainingAmount) {
      return res.status(400).json({ error: 'Insufficient fund balance' })
    }

    // Create a transaction
    await Transaction.create({
      sharedFund: fund._id,
      createdBy: req.user._id,
      type: 'expense',
      amount,
      category,
      description
    })

    // Deduct from fund
    fund.remainingAmount -= amount
    await fund.save()

    // ✅ Deduct from linked Source balance (if set)
    if (fund.source) {
      await Source.findByIdAndUpdate(fund.source, {
        $inc: { balance: -amount }
      })
    }

    // Notify other contributors
    const notifyList = new Set([
      String(fund.owner),
      ...fund.contributors.map(x => String(x))
    ])
    notifyList.delete(String(req.user._id))

    for (const uid of notifyList) {
      await Notification.create({
        user: uid,
        title: 'Shared Fund Expense',
        message: `${req.user.name} spent ₹${amount} on "${fund.name}"`
      })
    }

    res.json({ ok: true, remainingAmount: fund.remainingAmount })
  } catch (err) {
    console.error('Error adding expense:', err)
    res.status(500).json({ error: 'Server error adding expense' })
  }
})

export default router
