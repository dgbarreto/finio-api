import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { connectToDatabase } from './config/database'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

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

const start = async() => {
    await connectToDatabase()
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}

start()