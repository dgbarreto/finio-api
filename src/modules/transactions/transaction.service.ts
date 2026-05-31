import { Transaction, ITransaction, TransactionCategory, TransactionType } from './transaction.model'

interface CreateTransactionInput{
    userId: string
    description: string
    amount: number
    category: TransactionCategory
    type: TransactionType
    date: Date
    notes?: string
}

interface GetTransactionsFilter{
    userId: string
    category?: TransactionCategory
    type?: TransactionType
    startDate?: Date
    endDate?: Date
}

export const createTransaction = async (
    input: CreateTransactionInput
): Promise<ITransaction> => {
    const transaction = await Transaction.create(input)
    return transaction
}

export const getTransactions = async (
    filter: GetTransactionsFilter
): Promise<ITransaction[]> => {
    const query: any = { userId: filter.userId }

    if (filter.category) query.category = filter.category
    if (filter.type) query.type = filter.type
    if (filter.startDate || filter.endDate) {
        query.date = {}
        if (filter.startDate) query.date.$gte = filter.startDate
        if (filter.endDate) query.date.$lte = filter.endDate
    }

    return await Transaction.find(query).sort({ date: -1 })
}

export const getTransactionById = async(
    id: string,
    userId: string
): Promise<ITransaction | null> => {
    return await Transaction.findOne({ _id: id, userId })
}

export const updateTransaction = async(
    id: string,
    userId: string,
    data: Partial<CreateTransactionInput>
): Promise<ITransaction | null> => {
    return await Transaction.findOneAndUpdate(
        { _id: id, userId },
        { $set: data },
        { new: true, runValidators: true }
    )
}

export const deleteTransaction = async(
    id: string,
    userId: string
): Promise<boolean> => {
    const result = await Transaction.deleteOne({ _id: id, userId })
    return result.deletedCount > 0
}

export const getSummary = async(userId: string) => {
    const result = await Transaction.aggregate([
        { $match: { userId: new (require("mongoose").Types.ObjectId)(userId) } },
        {
            $group: {
                _id: "$type",
                total: { $sum: "$amount" }
            }
        }
    ])

    const income = result.find(r => r._id === "income")?.total || 0
    const expense = result.find(r => r._id === "expense")?.total || 0

    return { income, expense, balance: income - expense }
}
