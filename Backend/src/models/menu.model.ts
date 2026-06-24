import mongoose, { Document, model, Schema } from "mongoose";
import { MenuItemType } from "../types/menu.types";

export interface IMenuItem extends  Omit< MenuItemType,'restaurantId'>, Document {
    restaurantId: mongoose.Types.ObjectId;
   
}

const menuItemModelSchema: Schema = new Schema<IMenuItem>({
    restaurantId: { type: Schema.Types.ObjectId, required: true, ref: "Restaurant" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: false },
    isAvailable: { type: Boolean, required: true, default: true },
    preparationTime: { type: Number, required: true },
}, {
    timestamps: true
});

export default model<IMenuItem>("MenuItem", menuItemModelSchema);