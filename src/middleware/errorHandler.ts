import * as Sentry from "@sentry/node"
import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../errors/AppError'

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (!(err instanceof ZodError) && !(err instanceof AppError)) {
        Sentry.captureException(err, {
            extra: {
                url: req.url,
                method: req.method,
                body: req.body
            }
        })
    }

    if (err instanceof ZodError) {
        const messages = err.issues.map(e => `${e.path.join('.')}: ${e.message}`)
        res.status(400).json({ error: 'Validation Error', details: messages })
        return
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message, code: err.code })
        return
    }

    console.error('Unexpected error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
}
