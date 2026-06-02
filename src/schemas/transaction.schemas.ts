import { z } from 'zod'

const TransactionType = z.enum(['income', 'expense'])
const TransactionCategory = z.enum([
    'food', 'transport', 'health', 'entertainment', 'salary', 'other'
])

export const createTransactionSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    amount: z.number().positive('Amount must be a positive number'),
    type: TransactionType,
    category: TransactionCategory,
    date: z.iso.datetime({ local: true }).optional(),
    notes: z.string().optional()
})

export const updateTransactionSchema = createTransactionSchema.partial()