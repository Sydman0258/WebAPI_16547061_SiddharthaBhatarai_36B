import mongoose, { Document, Schema } from "mongoose";
import { SavedCardType, EsewaAccountType } from "../types/payment.types";

export interface IPayment extends Document {
    _id: mongoose.Types.ObjectId;

    userId: mongoose.Types.ObjectId;

    paymentType: "card" | "esewa";

    card?: SavedCardType;

    esewa?: EsewaAccountType;

    isDefault: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const SavedCardSchema = new Schema(
    {
        cardHolderName: {
            type: String,
            required: true,
        },
        cardBrand: {
            type: String,
            required: true,
        },
        cardNumber: {
            type: String,
            required: true,
        },
        expiryMonth: {
            type: String,
            required: true,
        },
        expiryYear: {
            type: String,
            required: true,
        },
    },
    {
        _id: false,
    }
);

const EsewaAccountSchema = new Schema(
    {
        accountName: {
            type: String,
            required: true,
        },
        mobileNumber: {
            type: String,
            required: true,
        },
    },
    {
        _id: false,
    }
);

const PaymentSchema = new Schema<IPayment>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        paymentType: {
            type: String,
            enum: ["card", "esewa"],
            required: true,
        },

        card: {
            type: SavedCardSchema,
        },

        esewa: {
            type: EsewaAccountSchema,
        },

        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IPayment>("Payment", PaymentSchema);