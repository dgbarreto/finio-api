import mongoose, { Document, Schema } from "mongoose"

export interface IBudget extends Document {
    userId: mongoose.Types.ObjectId,
    category: string,
    limit: number,
    period: 'weekly' | 'monthly',
    startDate: Date,
    endDate: Date,
    createdAt: Date,
    updatedAt: Date
}

const BudgetSchema: Schema = new Schema<IBudget>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        category: { type: String, required: true },
        limit: { type: Number, required: true },
        period: { type: String, enum: ['weekly', 'monthly'], required: true },
        endDate: { type: Date, required: true }
    },
    { timestamps: true }
)

export const Budget = mongoose.model<IBudget>('Budget', BudgetSchema)