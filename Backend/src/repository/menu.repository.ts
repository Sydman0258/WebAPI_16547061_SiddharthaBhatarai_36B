// menuItem.repository.ts
import mongoose from "mongoose";
import MenuItem, { IMenuItem } from "../models/menu.model";

export interface IMenuItemRepository {
    create(data: Partial<IMenuItem>): Promise<IMenuItem>;
    findById(id: string): Promise<IMenuItem | null>;
    findByRestaurantId(restaurantId: string): Promise<IMenuItem[]>;
    findByCategory(restaurantId: string, category: string): Promise<IMenuItem[]>;
    findAvailable(restaurantId: string): Promise<IMenuItem[]>;
    update(id: string, data: Partial<IMenuItem>): Promise<IMenuItem | null>;
    delete(id: string): Promise<boolean>;
}

export class MenuItemMongoRepository implements IMenuItemRepository {
    async create(data: Partial<IMenuItem>): Promise<IMenuItem> {
        return await MenuItem.create(data);
    }
    async findById(id: string): Promise<IMenuItem | null> {
        return await MenuItem.findById(id).populate("restaurantId");
    }
    async findByRestaurantId(restaurantId: string): Promise<IMenuItem[]> {
        return await MenuItem.find({
            restaurantId: new mongoose.Types.ObjectId(restaurantId)
        });
    }
    async findByCategory(restaurantId: string, category: string): Promise<IMenuItem[]> {
        return await MenuItem.find({
            restaurantId: new mongoose.Types.ObjectId(restaurantId),
            category
        });
    }
    async findAvailable(restaurantId: string): Promise<IMenuItem[]> {
        return await MenuItem.find({
            restaurantId: new mongoose.Types.ObjectId(restaurantId),
            isAvailable: true
        });
    }
    async update(id: string, data: Partial<IMenuItem>): Promise<IMenuItem | null> {
        return await MenuItem.findByIdAndUpdate(
            id, { $set: data }, { new: true, runValidators: true }
        );
    }
    async delete(id: string): Promise<boolean> {
        const result = await MenuItem.findByIdAndDelete(id);
        return !!result;
    }
}