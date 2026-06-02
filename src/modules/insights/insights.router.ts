import { Router } from 'express'
import { authenticate } from '../../middleware/auth'
import { validate } from '../../middleware/validate'
import { insightsPeriodSchema } from '../../schemas/insights.schemas'
import { getSpendingByCategory, getMonthlyEvolution, getSummary } from './insights.controller'

const router = Router()

router.use(authenticate)

router.post('/spending-by-category', validate(insightsPeriodSchema), getSpendingByCategory)
router.get('/monthly-evolution', getMonthlyEvolution)
router.post('/summary', validate(insightsPeriodSchema), getSummary)

export default router