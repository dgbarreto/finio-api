import { Budget, IBudget } from "./budget.model"
import { Transaction } from "../transactions/transaction.model"
import { AppError } from "../../errors/AppError"
import mongoose from "mongoose"

interface BudgetWithProgress{
    _id: string,
    userId: mongoose.Types.ObjectId,
    category: string,
    limit: number,
    period: 'weekly' | 'monthly',
    startDate: Date,
    endDate: Date,
    spent: number,
    remaining: number,
    percentage: number,
    exceeded: boolean
}

export const createBudget = async (
    userId: string,
    data: Partial<IBudget>
): Promise<IBudget> => {
    const existingBudget = await Budget.findOne({
        userId,
        category: data.category,
        period: data.period,
        startDate: data.startDate
    })

    if (existingBudget) {
        throw new AppError("Budget for this category and period already exists", 409)
    }

    return Budget.create({ ...data, userId })
}

export const getBudgetsWithProgress = async (userId: string): Promise<BudgetWithProgress[]> => {
    const budgets = await Budget.find({ userId })

    const budgetsWithProgress = await Promise.all(
        budgets.map(async (budget) => {
            const result = await Transaction.aggregate([
                {
                    $match: {
                        userId: budget.userId,
                        category: budget.category,
                        date: { $gte: budget.startDate, $lte: budget.endDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ])

            const spent = result[0]?.total || 0
            const remaining = budget.limit - spent
            const percentage = Math.round((spent / budget.limit) * 100)

            return {
                ...budget.toObject(),
                _id: budget._id.toString(),
                spent,
                remaining,
                percentage,
                exceeded: spent > budget.limit
            }
        })
    )

    return budgetsWithProgress
}

export const updateBudget = async (
    userId: string,
    budgetId: string,
    data: Partial<IBudget>
) => {
    const budget = await Budget.findOneAndUpdate(
        { _id: budgetId, userId },
        data,
        { new: true }
    )

    if(!budget) {
        throw new AppError("Budget not found", 404)
    }

    return budget
}

export const deleteBudget = async (
    userId: string,
    budgetId: string
): Promise<void> => {
    const budget = await Budget.findOneAndDelete({ _id: budgetId, userId })

    if(!budget) {
        throw new AppError("Budget not found", 404)
    }
}