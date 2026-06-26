import { Router } from 'express'
import * as authController from './auth.controller'
import { authenticate } from '../../middleware/auth'
import { validate } from '../../middleware/validate'
import { registerSchema, loginSchema } from '../../schemas/auth.schemas'

const router = Router()

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)
router.get('/profile', authenticate, authController.profile)
router.post('fcm-token', authenticate, authController.updateFcmToken)

export default router