import mongoose from "mongoose";
import { MenuItemService } from "../../../services/menu.service";
import { MenuItemMongoRepository } from "../../../repository/menu.repository";
import { RestaurantMongoRepository } from "../../../repository/restaurant.repository";
import { HttpException } from "../../../exceptions/http-exceptions";
import { createMenuItemDTO, updateMenuItemDTO } from "../../../dtos/menu.dtos";

jest.mock("../../../repository/menu.repository");
jest.mock("../../../repository/restaurant.repository");

describe("MenuItemService", () => {
    let menuItemService: MenuItemService;
    let mockMenuItemRepo: jest.Mocked<MenuItemMongoRepository>;
    let mockRestaurantRepo: jest.Mocked<RestaurantMongoRepository>;

    beforeEach(() => {
        menuItemService = new MenuItemService();
        mockMenuItemRepo = MenuItemMongoRepository.prototype as jest.Mocked<MenuItemMongoRepository>;
        mockRestaurantRepo = RestaurantMongoRepository.prototype as jest.Mocked<RestaurantMongoRepository>;
        jest.clearAllMocks();
    });

    const validRestaurantId = new mongoose.Types.ObjectId();
    const validMenuItemId = new mongoose.Types.ObjectId();

    const mockRestaurant = {
        _id: validRestaurantId,
        restaurantName: "Test Restaurant",
    } as any;

    const mockMenuItem = {
        _id: validMenuItemId,
        restaurantId: validRestaurantId,
        name: "Momo",
        description: "Yummy Momo",
        price: 250,
        category: "Veg",
        isAvailable: true,
        preparationTime: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
    } as any;

    describe("createMenuItem", () => {
        const createData: createMenuItemDTO = {
            name: "Momo",
            description: "Yummy Momo",
            price: 250,
            category: "Veg",
            preparationTime: 15,
        };

        it("should successfully create a new menu item if restaurant exists", async () => {
            mockRestaurantRepo.findById.mockResolvedValue(mockRestaurant);
            mockMenuItemRepo.create.mockResolvedValue(mockMenuItem);

            const result = await menuItemService.createMenuItem(validRestaurantId.toString(), createData);

            expect(mockRestaurantRepo.findById).toHaveBeenCalledWith(validRestaurantId.toString());
            expect(mockMenuItemRepo.create).toHaveBeenCalledWith({
                ...createData,
                restaurantId: expect.any(mongoose.Types.ObjectId),
            });
            expect(result).toEqual(mockMenuItem);
        });

        it("should throw 404 if restaurant does not exist", async () => {
            mockRestaurantRepo.findById.mockResolvedValue(null);

            await expect(menuItemService.createMenuItem(validRestaurantId.toString(), createData))
                .rejects.toMatchObject({
                    status: 404,
                    message: "Restaurant not found",
                });
        });
    });

    describe("getMenuItemById", () => {
        it("should return menu item when found", async () => {
            mockMenuItemRepo.findById.mockResolvedValue(mockMenuItem);

            const result = await menuItemService.getMenuItemById(validMenuItemId.toString());

            expect(mockMenuItemRepo.findById).toHaveBeenCalledWith(validMenuItemId.toString());
            expect(result).toEqual(mockMenuItem);
        });

        it("should throw 404 if menu item not found", async () => {
            mockMenuItemRepo.findById.mockResolvedValue(null);

            await expect(menuItemService.getMenuItemById("nonexistent"))
                .rejects.toMatchObject({
                    status: 404,
                    message: "Menu item not found",
                });
        });
    });

    describe("getMenuByRestaurant", () => {
        it("should return menu list if restaurant exists", async () => {
            mockRestaurantRepo.findById.mockResolvedValue(mockRestaurant);
            mockMenuItemRepo.findByRestaurantId.mockResolvedValue([mockMenuItem]);

            const result = await menuItemService.getMenuByRestaurant(validRestaurantId.toString());

            expect(mockRestaurantRepo.findById).toHaveBeenCalledWith(validRestaurantId.toString());
            expect(mockMenuItemRepo.findByRestaurantId).toHaveBeenCalledWith(validRestaurantId.toString());
            expect(result).toEqual([mockMenuItem]);
        });

        it("should throw 404 if restaurant not found", async () => {
            mockRestaurantRepo.findById.mockResolvedValue(null);

            await expect(menuItemService.getMenuByRestaurant(validRestaurantId.toString()))
                .rejects.toMatchObject({
                    status: 404,
                    message: "Restaurant not found",
                });
        });
    });

    describe("getMenuByCategory", () => {
        it("should return category menu list if restaurant exists", async () => {
            mockRestaurantRepo.findById.mockResolvedValue(mockRestaurant);
            mockMenuItemRepo.findByCategory.mockResolvedValue([mockMenuItem]);

            const result = await menuItemService.getMenuByCategory(validRestaurantId.toString(), "Veg");

            expect(mockRestaurantRepo.findById).toHaveBeenCalledWith(validRestaurantId.toString());
            expect(mockMenuItemRepo.findByCategory).toHaveBeenCalledWith(validRestaurantId.toString(), "Veg");
            expect(result).toEqual([mockMenuItem]);
        });

        it("should throw 404 if restaurant not found", async () => {
            mockRestaurantRepo.findById.mockResolvedValue(null);

            await expect(menuItemService.getMenuByCategory(validRestaurantId.toString(), "Veg"))
                .rejects.toMatchObject({
                    status: 404,
                    message: "Restaurant not found",
                });
        });
    });

    describe("getAvailableMenu", () => {
        it("should return available items if restaurant exists", async () => {
            mockRestaurantRepo.findById.mockResolvedValue(mockRestaurant);
            mockMenuItemRepo.findAvailable.mockResolvedValue([mockMenuItem]);

            const result = await menuItemService.getAvailableMenu(validRestaurantId.toString());

            expect(mockRestaurantRepo.findById).toHaveBeenCalledWith(validRestaurantId.toString());
            expect(mockMenuItemRepo.findAvailable).toHaveBeenCalledWith(validRestaurantId.toString());
            expect(result).toEqual([mockMenuItem]);
        });

        it("should throw 404 if restaurant not found", async () => {
            mockRestaurantRepo.findById.mockResolvedValue(null);

            await expect(menuItemService.getAvailableMenu(validRestaurantId.toString()))
                .rejects.toMatchObject({
                    status: 404,
                    message: "Restaurant not found",
                });
        });
    });

    describe("updateMenuItem", () => {
        const updateData: updateMenuItemDTO = {
            name: "Updated Momo",
            price: 260,
        };

        it("should update menu item successfully", async () => {
            mockMenuItemRepo.findById.mockResolvedValue(mockMenuItem);
            mockMenuItemRepo.update.mockResolvedValue({ ...mockMenuItem, ...updateData } as any);

            const result = await menuItemService.updateMenuItem(validMenuItemId.toString(), updateData);

            expect(mockMenuItemRepo.findById).toHaveBeenCalledWith(validMenuItemId.toString());
            expect(mockMenuItemRepo.update).toHaveBeenCalledWith(validMenuItemId.toString(), updateData);
            expect(result).toBeDefined();
        });

        it("should throw 404 if menu item not found", async () => {
            mockMenuItemRepo.findById.mockResolvedValue(null);

            await expect(menuItemService.updateMenuItem("invalid", updateData))
                .rejects.toMatchObject({
                    status: 404,
                    message: "Menu item not found",
                });
        });

        it("should throw 500 if update fails", async () => {
            mockMenuItemRepo.findById.mockResolvedValue(mockMenuItem);
            mockMenuItemRepo.update.mockResolvedValue(null);

            await expect(menuItemService.updateMenuItem(validMenuItemId.toString(), updateData))
                .rejects.toMatchObject({
                    status: 500,
                    message: "Failed to update menu item",
                });
        });
    });

    describe("toggleAvailability", () => {
        it("should toggle availability successfully", async () => {
            mockMenuItemRepo.findById.mockResolvedValue(mockMenuItem);
            mockMenuItemRepo.update.mockResolvedValue({ ...mockMenuItem, isAvailable: false } as any);

            const result = await menuItemService.toggleAvailability(validMenuItemId.toString());

            expect(mockMenuItemRepo.findById).toHaveBeenCalledWith(validMenuItemId.toString());
            expect(mockMenuItemRepo.update).toHaveBeenCalledWith(validMenuItemId.toString(), { isAvailable: false });
            expect(result.isAvailable).toBe(false);
        });

        it("should throw 404 if menu item not found", async () => {
            mockMenuItemRepo.findById.mockResolvedValue(null);

            await expect(menuItemService.toggleAvailability("invalid"))
                .rejects.toMatchObject({
                    status: 404,
                    message: "Menu item not found",
                });
        });
    });

    describe("deleteMenuItem", () => {
        it("should delete menu item successfully", async () => {
            mockMenuItemRepo.findById.mockResolvedValue(mockMenuItem);
            mockMenuItemRepo.delete.mockResolvedValue(true);

            const result = await menuItemService.deleteMenuItem(validMenuItemId.toString());

            expect(mockMenuItemRepo.findById).toHaveBeenCalledWith(validMenuItemId.toString());
            expect(mockMenuItemRepo.delete).toHaveBeenCalledWith(validMenuItemId.toString());
            expect(result).toBe(true);
        });

        it("should throw 404 if menu item not found to delete", async () => {
            mockMenuItemRepo.findById.mockResolvedValue(null);

            await expect(menuItemService.deleteMenuItem("invalid"))
                .rejects.toMatchObject({
                    status: 404,
                    message: "Menu item not found",
                });
        });
    });
});
