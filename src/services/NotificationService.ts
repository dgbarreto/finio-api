import { messaging } from "../firebase"

export class NotificationService{
    static async sendBudgetAlert(
        fcmToken: string,
        category: string,
        percentage: number
    ): Promise<void>{
        try{
            await messaging.send({
                token: fcmToken,
                notification: {
                    title: "Budget Alert 🚨",
                    body: "You've used ${percentage}% of your ${category} budget"
                },
                data: {
                    type: "budget_alert",
                    category,
                    percentage: percentage.toString()
                }
            })
        } catch(err){
            console.error("Failed to send push notification: ", err)
        }
    }
}