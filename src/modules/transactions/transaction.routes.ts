import { Router } from "express"
import * as transactionController from "./transaction.controller"
import { authenticate } from "../../middleware/auth"

const router = Router()

router.use(authenticate)

router.post("/", transactionController.create)
router.get("/", transactionController.getAll)
router.get("/summary", transactionController.summary)
router.get("/:id", transactionController.getById)
router.put("/:id", transactionController.update)
router.delete("/:id", transactionController.remove)

export default router