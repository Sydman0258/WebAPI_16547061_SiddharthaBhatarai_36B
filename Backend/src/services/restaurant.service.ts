import { HttpException } from "../exceptions/http-exceptions";
import { RestaurantMongoRepository } from "../repository/restaurant.repository";
import { createRestaurantDTO, UpdateRestaurantDTO } from "../dtos/restaurant.dtos";

const restaurantRepository = new RestaurantMongoRepository();

export class RestaurantService {

  async createRestaurant(restaurantData: createRestaurantDTO & { userId: string }) {
    const existing = await restaurantRepository.findByUserId(restaurantData.userId);
    if (existing) {
      throw new HttpException(400, "A restaurant already exists for this user");
    }
    const restaurant = await restaurantRepository.createRestaurant(restaurantData as any);
    return restaurant;
  }

  async getRestaurantById(id: string) {
    const restaurant = await restaurantRepository.findById(id);
    if (!restaurant) {
      throw new HttpException(404, `Restaurant not found`);
    }
    return restaurant;
  }

  async getAllRestaurants() {
    const restaurants = await restaurantRepository.findAll();
    return restaurants;
  }

  async getRestaurantByUserId(userId: string) {
    const restaurant = await restaurantRepository.findByUserId(userId);
    if (!restaurant) {
      throw new HttpException(404, "Restaurant not found for this user");
    }
    return restaurant;
  }

  async updateRestaurant(id: string, updateData: UpdateRestaurantDTO) {
    const restaurant = await restaurantRepository.findById(id);
    if (!restaurant) {
      throw new HttpException(404, "Restaurant not found");
    }
    const updated = await restaurantRepository.update(id, updateData as any);
    if (!updated) {
      throw new HttpException(500, "Failed to update restaurant");
    }
    return updated;
  }

  async deleteRestaurant(id: string) {
    const restaurant = await restaurantRepository.findById(id);
    if (!restaurant) {
      throw new HttpException(404, "Restaurant not found");
    }
    return await restaurantRepository.delete(id);
  }
}