import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { connectToDatabase } from './config/database'
import { errorHandler } from './middleware/errorHandler'
import path from 'path'
import authRoutes from './modules/auth/auth.routes'
import transactionRoutes from './modules/transactions/transaction.routes'
import budgetRoutes from './modules/budget/budget.router'
import insightsRoutes from './modules/insights/insights.router'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env') })
}

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
app.use('/budgets', budgetRoutes)
app.use('/insights', insightsRoutes)

app.use(errorHandler)

const start = async() => {
    await connectToDatabase()
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}

start()