import { Router } from "express"
import * as transactionController from "./transaction.controller"
import { authenticate } from "../../middleware/auth"
import { validate } from "../../middleware/validate"
import { createTransactionSchema, updateTransactionSchema } from "../../schemas/transaction.schemas"

const router = Router()

router.use(authenticate)

router.post("/", validate(createTransactionSchema), transactionController.create)
router.get("/", transactionController.getAll)
router.get("/summary", transactionController.summary)
router.get("/:id", transactionController.getById)
router.put("/:id", validate(updateTransactionSchema), transactionController.update)
router.delete("/:id", transactionController.remove)

export default router