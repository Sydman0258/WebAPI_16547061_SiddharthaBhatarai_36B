// driver.repository.ts
import mongoose from "mongoose";
import Driver, { IDriver } from "../models/driver.model";

export interface IDriverRepository {
    create(data: Partial<IDriver>): Promise<IDriver>;
    findById(id: string): Promise<IDriver | null>;
    findByUserId(userId: string): Promise<IDriver | null>;
    findAll(): Promise<IDriver[]>;
    findAvailable(): Promise<IDriver[]>;
    update(id: string, data: Partial<IDriver>): Promise<IDriver | null>;
    delete(id: string): Promise<boolean>;
}

export class DriverMongoRepository implements IDriverRepository {
    async create(data: Partial<IDriver>): Promise<IDriver> {
        return await Driver.create(data);
    }
    async findById(id: string): Promise<IDriver | null> {
        return await Driver.findById(id).populate("userId");
    }
    async findByUserId(userId: string): Promise<IDriver | null> {
        return await Driver.findOne({
            userId: new mongoose.Types.ObjectId(userId)
        }).populate("userId");
    }
    async findAll(): Promise<IDriver[]> {
        return await Driver.find().populate("userId");
    }
    async findAvailable(): Promise<IDriver[]> {
        return await Driver.find({ isAvailable: true }).populate("userId");
    }
    async update(id: string, data: Partial<IDriver>): Promise<IDriver | null> {
        return await Driver.findByIdAndUpdate(
            id, { $set: data }, { new: true, runValidators: true }
        );
    }
    async delete(id: string): Promise<boolean> {
        const result = await Driver.findByIdAndDelete(id);
        return !!result;
    }
}