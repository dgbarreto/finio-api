import mongoose, { Document, Schema } from "mongoose"

export type TransactionCategory = 
    | "food"
    | "transport"
    | "health"
    | "entertainment"
    | "salary"
    | "other"

export type TransactionType = "income" | "expense"

export interface ITransaction extends Document{
    userId: mongoose.Types.ObjectId
    description: string
    amount: number
    category: TransactionCategory
    type: TransactionType
    date: Date
    notes?: string
    createdAt: Date
    updatedAt: Date
}

const TransactionSchema = new Schema<ITransaction>(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "User"
        },
        description: {
            type: String,
            required: [ true, "Description is required" ],
            trim: true,
            maxlength: [ 100, "Description cannot exceed 100 characters" ]
        },
        amount: {
            type: Number,
            required: [ true, "Amount is required" ],
            min: [ 0.01, "Amount cannot be non zero" ]
        },
        category: {
            type: String,
            required: [ true, "Category is required" ],
            enum: [ "food", "transport", "health", "entertainment", "salary", "other" ]
        },
        type: {
            type: String,
            required: [ true, "Type is required" ],
            enum: [ "income", "expense" ]
        },
        date: {
            type: Date,
            required: [ true, "Date is required" ],
            default: Date.now
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [ 500, "Notes cannot exceed 500 characters" ]
        }
    },
    {
        timestamps: true
    }
)

TransactionSchema.index({ userId: 1, date: -1 })

export const Transaction = mongoose.model<ITransaction>(
    "Transaction", 
    TransactionSchema
)