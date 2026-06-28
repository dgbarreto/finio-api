import { Router, Request, Response, NextFunction } from "express"
import { authenticate } from "../../middleware/auth"
import * as debugController from "./debug.controller"

const router = Router()

router.post("/push", authenticate, debugController.sendPush)

export default router