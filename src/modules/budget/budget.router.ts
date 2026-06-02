import { Router } from "express"
import { authenticate } from "../../middleware/auth"
import { validate } from "../../middleware/validate"
import { createBudgetSchema, updateBudgetSchema } from "../../schemas/budget.schemas"
import { createBudget, getBudgets, updateBudget, deleteBudget } from "./budget.controller"

const router = Router()

router.use(authenticate)

router.post("/", validate(createBudgetSchema), createBudget)
router.get("/", getBudgets)
router.put("/:id", validate(updateBudgetSchema), updateBudget)
router.delete("/:id", deleteBudget)

export default router