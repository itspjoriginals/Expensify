import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.js'
import requestRoutes from './routes/requests.js'
import sharedFundRoutes from './routes/sharedFunds.js'
import transactionRoutes from './routes/transactions.js'
import sourceRoutes from './routes/sources.js'
import notificationRoutes from './routes/notifications.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || '*', credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.get('/', (req, res) => res.json({ ok: true, message: 'Multi-Source Expense API' }))
app.use('/api/auth', authRoutes)
app.use('/api/requests', requestRoutes)
app.use('/api/shared-funds', sharedFundRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/sources', sourceRoutes)
app.use('/api/notifications', notificationRoutes)

// const allowedOrigins = process.env.CLIENT_ORIGIN?.split(',') || [];
// app.use(cors({
//   origin: allowedOrigins.length ? allowedOrigins : '*',
//   credentials: true,
// }));


const PORT = process.env.PORT || 5000
connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
})
