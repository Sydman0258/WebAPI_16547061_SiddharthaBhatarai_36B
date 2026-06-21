import mongoose, { Document, model, Schema } from "mongoose";
import { DriverType } from "../types/driver.types";

export interface IDriver extends Omit<DriverType, 'userId'>, Document {
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const driverModelSchema: Schema = new Schema<IDriver>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    vehicleType: { type: String, enum: ["Car", "Bike", "Bicycle"], required: true },
    vehicleNumber: { type: String, required: false, default: null },
    isAvailable: { type: Boolean, required: true, default: false },
    currentLocation: { type: String, required: true },
    isVerified: { type: Boolean, required: true, default: false },
    ratings: { type: Number, required: true, default: 0 },
    totalDeliveries: { type: Number, required: true, default: 0 },
}, {
    timestamps: true
});

export default model<IDriver>("Driver", driverModelSchema);