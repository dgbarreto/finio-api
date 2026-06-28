import { Request, Response, NextFunction } from 'express'
import { authenticate } from '../../middleware/auth'
import * as debugService from "./debug.services"

export const sendPush = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const userId = (req as any).userId
        debugService.sendPush(userId)

        res.status(200).json({ message: "Push notification sent successfully" })
    } catch(err){
        next(err)
    }
}