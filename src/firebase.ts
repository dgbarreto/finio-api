import { initializeApp, getApps, cert, getApp } from "firebase-admin/app"
import { getMessaging } from "firebase-admin/messaging"

const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT ?? "{}"
)

if(!getApps().length){
    initializeApp({
        credential: cert(serviceAccount)
    })
}

export const messaging = getMessaging()