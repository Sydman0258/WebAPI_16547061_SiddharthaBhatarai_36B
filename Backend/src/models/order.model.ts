import mongoose, { Document, model, Schema } from "mongoose";

interface IOrderItem {
    menuItemId: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    unitPrice: number;
}

export interface IOrder extends Document {
    customerId: mongoose.Types.ObjectId;
    restaurantId: mongoose.Types.ObjectId;
    driverId?: mongoose.Types.ObjectId;
    items: IOrderItem[];
    status: "pending" | "confirmed" | "preparing" | "ready" | "picked_up" | "delivered" | "cancelled";
    deliveryAddress: string;
    subtotal: number;
    deliveryFee: number;
    total: number;
    notes?: string;
    placedAt: Date;
    estimatedDelivery?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
    menuItemId: { type: Schema.Types.ObjectId, required: true, ref: "MenuItem" },
    name: { type: String, required: true },        // snapshot
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },   // snapshot
}, { _id: false });                                // no separate _id per item

const orderModelSchema: Schema = new Schema<IOrder>({
    customerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    restaurantId: { type: Schema.Types.ObjectId, required: true, ref: "Restaurant" },
    driverId: { type: Schema.Types.ObjectId, required: false, ref: "Driver" },
    items: { type: [orderItemSchema], required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "preparing", "ready", "picked_up", "delivered", "cancelled"],
        required: true,
        default: "pending"
    },
    deliveryAddress: { type: String, required: true },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    notes: { type: String, required: false },
    placedAt: { type: Date, required: true, default: Date.now },
    estimatedDelivery: { type: Date, required: false },
}, {
    timestamps: true
});

export default model<IOrder>("Order", orderModelSchema);