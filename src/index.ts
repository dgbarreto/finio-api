import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { connectToDatabase } from './config/database'
import path from 'path'
import authRoutes from './modules/auth/auth.routes'
import transactionRoutes from './modules/transactions/transaction.routes'
import fs from 'fs'

const envPath = path.resolve(__dirname, '../.env')
console.log('Looking for .env at:', envPath)
console.log('File exists:', fs.existsSync(envPath))

console.log('process.env.NODE_ENV:', process.env.NODE_ENV)

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env') })
  console.log('Loaded .env file for development')
}

console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI)

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(helmet())
app.use(express.json())

//Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    })
})

app.use('/auth', authRoutes)
app.use('/transactions', transactionRoutes)

const start = async() => {
    await connectToDatabase()
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}

start()