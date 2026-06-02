import mongoose from 'mongoose'
import { Transaction } from '../transactions/transaction.model'

interface PeriodFilter{
    startDate: string
    endDate: string
}

interface SpendingCategory{
    category: string
    total: number
    percentage: number
}

interface MonthlyEvolution{
    year: number
    month: number
    incomes: number
    expenses: number
    balance: number
}

interface InsightsSummary{
    totalIncomes: number
    totalExpenses: number
    balance: number
    topCategory: string | null
}

export const getSpendingByCategory = async (
    userId: string,
    { startDate, endDate }: PeriodFilter
): Promise<SpendingCategory[]> => {
    const result = await Transaction.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                type: 'expense',
                date: { $gte: new Date(startDate), $lte: new Date(endDate)}
            }
        },
        {
            $group: {
                _id: '$category',
                total: { $sum: '$amount' }
            }
        },
        { $sort: { total: -1 } }
    ])   

    const grandTotal = result.reduce((sum, item) => sum + item.total, 0)

    return result.map(item => ({
        category: item._id,
        total: item.total,
        percentage: grandTotal > 0 ? (item.total / grandTotal) * 100 : 0
    }))
}

export const getMonthlyEvolution = async (
    userId: string,
    months: number = 6
): Promise<MonthlyEvolution[]> => {
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months + 1)
    startDate.setDate(1)
    startDate.setHours(0, 0, 0, 0)

    const result = await Transaction.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                date: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$date' },
                    month: { $month: '$date' },
                    type: '$type'
                },
                total: { $sum: '$amount' }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    const map = new Map<string, MonthlyEvolution>()

    for(const item of result) {
        const key = `${item._id.year}-${item._id.month}`
        if(!map.has(key)) {
            map.set(key, {
                year: item._id.year,
                month: item._id.month,
                incomes: 0,
                expenses: 0,
                balance: 0
            })
        }

        const entry = map.get(key)!
        if(item._id.type === 'income') {
            entry.incomes = item.total
        } else {
            entry.expenses = item.total
        }
        entry.balance = entry.incomes - entry.expenses
    }
    return Array.from(map.values())
}

export const getSummary = async (
    userId: string,
    { startDate, endDate }: PeriodFilter
): Promise<InsightsSummary> => {
    const result = await Transaction.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                date: { $gte: new Date(startDate), $lte: new Date(endDate) }
            }
        },
        {
            $group: {
                _id: '$type',
                total: { $sum: '$amount' }
            }
        }
    ])

    const income = result.find((r) => r._id === 'income')?.total || 0
    const expenses = result.find((r) => r._id === 'expense')?.total || 0

    const topCategoryResult = await Transaction.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                type: 'expense',
                date: { $gte: new Date(startDate), $lte: new Date(endDate) }
            }
        },
        { 
            $group: { _id: '$category', total: { $sum: '$amount' }}
        },
        { $sort: { total: -1 }},
        { $limit: 1 }
    ])

    return {
        totalIncomes: income, 
        totalExpenses: expenses,
        balance: income - expenses,
        topCategory: topCategoryResult[0]?._id || null
    }
}