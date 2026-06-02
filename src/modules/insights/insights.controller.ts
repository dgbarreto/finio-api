import { Request, Response, NextFunction } from 'express'
import * as InsightsService from './insights.service'

export const getSpendingByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).userId
        const data = await InsightsService.getSpendingByCategory(userId, req.body)
        res.json(data)
    } catch (error) {
        next(error)
    }
}

export const getMonthlyEvolution = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).userId
        const months = req.query.months ? parseInt(req.query.months as string, 10) : 6
        const data = await InsightsService.getMonthlyEvolution(userId, months)
        res.json(data)  
    } catch (error) {
        next(error)
    }
}

export const getSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const userId = (req as any).userId
        const data = await InsightsService.getSummary(userId, req.body)
        res.json(data)  
    } catch (error) {
        next(error)
    }
}