import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import subscriberRouter from './routes/subscriberRouter.js'
import dotenv from 'dotenv'
dotenv.config();

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
// Serve static files (for uploaded images)
app.use('/uploads', express.static('uploads'))

// Connect to MongoDB
connectDB()

// API Endpoints
app.use('/api/subscribers', subscriberRouter)

app.get('/', (req, res) => {
  res.send("API Working")
})

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`)
})
