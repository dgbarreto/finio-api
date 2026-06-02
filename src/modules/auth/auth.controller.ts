import { Request, Response, NextFunction } from 'express'
import * as authService from './auth.service'
import { AppError } from '../../errors/AppError'

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            throw new AppError('Name, email, and password are required', 400)
        }

        const result = await authService.register({ name, email, password })
        res.status(201).json(result)
    } catch (error: any) {
        if(error.message === 'Email is already in use') {
            throw new AppError(error.message, 409)
        }
        next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            throw new AppError('Email and password are required', 400)
        }

        const result = await authService.login({ email, password })
        res.status(200).json(result)
    } catch (error: any) {
        if(error.message === 'Invalid email or password') {
            throw new AppError(error.message, 401)
        }
        next(error)
    }
}

export const profile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).userId
        const user = await authService.getProfile(userId)
        res.status(200).json(user)
    } catch (error: any) {
        next(error)
    }
}