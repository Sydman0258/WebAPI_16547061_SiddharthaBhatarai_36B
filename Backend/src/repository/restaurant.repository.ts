import mongoose from "mongoose";
import restaurantModel, { IRestaurant } from "../models/restaurant.model";

export interface IRestaurantRepository {
  createRestaurant(restaurantData: any): Promise<IRestaurant>;
  findById(id: string): Promise<IRestaurant | null>;
  findAll(): Promise<IRestaurant[]>;
  findByUserId(userId: string): Promise<IRestaurant | null>;
  update(id: string, data: Partial<IRestaurant>): Promise<IRestaurant | null>;
  delete(id: string): Promise<boolean>;
}

export class RestaurantMongoRepository implements IRestaurantRepository {
  async createRestaurant(restaurantData: any): Promise<IRestaurant> {
    return await restaurantModel.create(restaurantData);
  }

  async findById(id: string): Promise<IRestaurant | null> {
    return await restaurantModel.findById(id).populate("userId");
  }

  async findAll(): Promise<IRestaurant[]> {
    return await restaurantModel.find().populate("userId");
  }

async findByUserId(userId: string): Promise<IRestaurant | null> {
  return await restaurantModel
    .findOne({ userId } as any)
    .populate("userId");
}
  async update(
    id: string,
    data: Partial<IRestaurant>
  ): Promise<IRestaurant | null> {
    return await restaurantModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await restaurantModel.findByIdAndDelete(id);
    return !!result;
  }
}