import { User } from "../auth/auth.model"
import { AppError } from "../../errors/AppError"
import { NotificationService } from "../../services/NotificationService"

export const sendPush = async(userId: string) => {
    const user = await User.findById(userId)
    if(!user?.fcmToken) throw new AppError("No FCM token registered for this user")

    await NotificationService.sendBudgetAlert(user.fcmToken, "food", 85)
}