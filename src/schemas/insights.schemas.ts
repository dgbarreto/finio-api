import { z } from 'zod'

export const insightsPeriodSchema = z.object({
    startDate: z.iso.datetime({ local: true }),
    endDate: z.iso.datetime({ local: true })
})