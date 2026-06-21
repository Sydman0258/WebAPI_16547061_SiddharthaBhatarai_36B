// menuItem.service.ts
import mongoose from "mongoose";
import { HttpException } from "../exceptions/http-exceptions";
import { MenuItemMongoRepository } from "../repository/menu.repository";
import { RestaurantMongoRepository } from "../repository/restaurant.repository";
import { createMenuItemDTO, updateMenuItemDTO } from "../dtos/menu.dtos";

const menuItemRepository = new MenuItemMongoRepository();
const restaurantRepository = new RestaurantMongoRepository();

export class MenuItemService {
    async createMenuItem(restaurantId: string, data: createMenuItemDTO) {
        const restaurant = await restaurantRepository.findById(restaurantId);
        if (!restaurant) throw new HttpException(404, "Restaurant not found");

        return await menuItemRepository.create({
            ...data,
            restaurantId: new mongoose.Types.ObjectId(restaurantId),
        });
    }

    async getMenuItemById(id: string) {
        const menuItem = await menuItemRepository.findById(id);
        if (!menuItem) throw new HttpException(404, "Menu item not found");
        return menuItem;
    }

    async getMenuByRestaurant(restaurantId: string) {
        const restaurant = await restaurantRepository.findById(restaurantId);
        if (!restaurant) throw new HttpException(404, "Restaurant not found");
        return await menuItemRepository.findByRestaurantId(restaurantId);
    }

    async getMenuByCategory(restaurantId: string, category: string) {
        const restaurant = await restaurantRepository.findById(restaurantId);
        if (!restaurant) throw new HttpException(404, "Restaurant not found");
        return await menuItemRepository.findByCategory(restaurantId, category);
    }

    async getAvailableMenu(restaurantId: string) {
        const restaurant = await restaurantRepository.findById(restaurantId);
        if (!restaurant) throw new HttpException(404, "Restaurant not found");
        return await menuItemRepository.findAvailable(restaurantId);
    }

    async updateMenuItem(id: string, data: updateMenuItemDTO) {
        const menuItem = await menuItemRepository.findById(id);
        if (!menuItem) throw new HttpException(404, "Menu item not found");

        const updated = await menuItemRepository.update(id, data);
        if (!updated) throw new HttpException(500, "Failed to update menu item");
        return updated;
    }

    async toggleAvailability(id: string) {
        const menuItem = await menuItemRepository.findById(id);
        if (!menuItem) throw new HttpException(404, "Menu item not found");
        return await menuItemRepository.update(id, { isAvailable: !menuItem.isAvailable });
    }

    async deleteMenuItem(id: string) {
        const menuItem = await menuItemRepository.findById(id);
        if (!menuItem) throw new HttpException(404, "Menu item not found");
        return await menuItemRepository.delete(id);
    }
}