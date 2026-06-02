import { Request, Response, NextFunction } from "express"
import * as transactionService from "./transaction.service"
import { AppError } from "../../errors/AppError"

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).userId
        const { description, amount, category, type, date, notes } = req.body

        if(!description || !amount || !category || !type ){
            throw new AppError("Missing required fields", 400)
        }

        const transaction = await transactionService.createTransaction({
            userId,
            description,
            amount,
            category,
            type,
            date,
            notes
        })

        res.status(201).json(transaction)
    } catch (error: any) {
        next(error)
    }
}

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const userId = (req as any).userId
        const { category, type, startDate, endDate } = req.query

        const transactions = await transactionService.getTransactions({
            userId,
            category: category as any,
            type: type as any,
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined
        })

        res.status(200).json(transactions)
    } catch (error: any) {
        next(error)
    }
}

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const userId = (req as any).userId
        const { id } = req.params
        
        const transaction = await transactionService.getTransactionById(id as string, userId)

        if(!transaction){
            throw new AppError("Transaction not found", 404)
        }

        res.status(200).json(transaction)
    } catch (error: any) {
        next(error)
    }
}

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const userId = (req as any).userId
        const { id } = req.params
        
        const transaction = await transactionService.updateTransaction(
            id as string, 
            userId, 
            req.body
        )

        if(!transaction){
            throw new AppError("Transaction not found", 404)
        }

        res.status(200).json(transaction)
    } catch (error: any) {
        next(error)
    }
}

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const userId = (req as any).userId
        const { id } = req.params

        const deleted = await transactionService.deleteTransaction(id as string, userId)

        if(!deleted){
            throw new AppError("Transaction not found", 404)
        }

        res.status(204).send()
    } catch (error: any) {
        next(error)
    }
}

export const summary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const userId = (req as any).userId
        const result = await transactionService.getSummary(userId)
        res.status(200).json(result)
    } catch (error: any) {
        next(error)
    }
}