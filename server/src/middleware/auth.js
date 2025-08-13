import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const auth = async (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.id).select('-passwordHash')
    if (!user) return res.status(401).json({ error: 'User not found' })
    req.user = user
    next()
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
