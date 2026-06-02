import { z } from 'zod'

export const createBudgetSchema = z.object({
    category: z.enum([ 'food', 'transport', 'health', 'entertainment', 'salary', 'other' ]),
    limit: z.number().positive('Limit must be a positive number'),
    period: z.enum(['weekly', 'monthly']),
    startDate: z.iso.datetime({ local: true }),
    endDate: z.iso.datetime({ local: true })
})

export const updateBudgetSchema = createBudgetSchema.partial()