import { Budget, IBudget } from "./budget.model"
import { Transaction } from "../transactions/transaction.model"
import { AppError } from "../../errors/AppError"
import mongoose from "mongoose"
import { User } from "../auth/auth.model"
import { NotificationService } from "../../services/NotificationService"

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
): Promise<BudgetWithProgress> => {
    const existingBudget = await Budget.findOne({
        userId,
        category: data.category,
        period: data.period,
        startDate: data.startDate
    })

    if (existingBudget) {
        throw new AppError("Budget for this category and period already exists", 409)
    }

    return await getBudgetWithProgress(await Budget.create({ ...data, userId }))
}

export const getBudgetsWithProgress = async (userId: string): Promise<BudgetWithProgress[]> => {
    const budgets = await Budget.find({ userId })

    const budgetsWithProgress = await Promise.all(
        budgets.map(async (budget) => {
            return getBudgetWithProgress(budget)
        })
    )

    return budgetsWithProgress
}

const getBudgetWithProgress = async (budget: IBudget): Promise<BudgetWithProgress> => {
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

    if(percentage >= 80){
        const user = await User.findById(budget.userId)
        if(user?.fcmToken){
            await NotificationService.sendBudgetAlert(
                user.fcmToken,
                budget.category,
                percentage
            )
        }
    }

    return {
        ...budget.toObject(),
        _id: budget._id.toString(),
        startDate: budget.startDate,
        spent,
        remaining,
        percentage,
        exceeded: spent > budget.limit
    }
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

    return getBudgetWithProgress(budget)
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