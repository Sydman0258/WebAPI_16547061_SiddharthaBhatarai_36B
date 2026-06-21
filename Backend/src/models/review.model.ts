import mongoose, { Document, model, Schema } from "mongoose";

export interface IReview extends Document {
    orderId: mongoose.Types.ObjectId;
    customerId: mongoose.Types.ObjectId;
    restaurantId?: mongoose.Types.ObjectId;
    driverId?: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}

const reviewModelSchema: Schema = new Schema<IReview>({
    orderId: { type: Schema.Types.ObjectId, required: true, ref: "Order" },
    customerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    restaurantId: { type: Schema.Types.ObjectId, required: false, ref: "Restaurant" },
    driverId: { type: Schema.Types.ObjectId, required: false, ref: "Driver" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false },
}, {
    timestamps: true
});

export default model<IReview>("Review", reviewModelSchema);