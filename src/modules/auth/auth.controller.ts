import { Request, Response } from 'express'
import * as authService from './auth.service'

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            res.status(400).json({ error: 'Name, email, and password are required' })
            return
        }

        const result = await authService.register({ name, email, password })
        res.status(201).json(result)
    } catch (error: any) {
        if(error.message === 'Email is already in use') {
            res.status(409).json({ error: error.message })
            return
        }
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' })
            return
        }

        const result = await authService.login({ email, password })
        res.status(200).json(result)
    } catch (error: any) {
        if(error.message === 'Invalid email or password') {
            res.status(401).json({ error: error.message })
            return
        }
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const profile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId
        const user = await authService.getProfile(userId)
        res.status(200).json(user)
    } catch (error: any) {
        res.status(404).json({ error: error.message })
    }
}