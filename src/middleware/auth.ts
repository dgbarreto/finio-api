import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload{
    userId: string
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Authorization header missing or malformed' })
        return
    }

    const token = authHeader.split(' ')[1]

    try {
        const secret = process.env.JWT_SECRET!
        const decoded = jwt.verify(token, secret) as JwtPayload

        ;(req as any).userId = decoded.userId
        next()
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' })
    }
}