import { Request, Response, NextFunction } from 'express'
import * as BudgetService from './budget.service'

export const createBudget = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).userId

        const budget = await BudgetService.createBudget(userId, req.body)
        res.status(201).json(budget)
    } catch (error: any) {
        next(error)
    }
}

export const getBudgets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).userId
        const budgets = await BudgetService.getBudgetsWithProgress(userId)
        res.json(budgets)
    } catch (error: any) {
        next(error)
    }
}

export const updateBudget = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).userId
        const { id } = req.params

        const budget = await BudgetService.updateBudget(userId, id as string, req.body)
        res.json(budget)
    } catch (error: any) {
        next(error)
    }
}

export const deleteBudget = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).userId
        const { id } = req.params

        await BudgetService.deleteBudget(userId, id as string)
        res.status(204).send()
    } catch (error: any) {
        next(error)
    }
}