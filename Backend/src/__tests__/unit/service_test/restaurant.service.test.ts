import mongoose from "mongoose";
import { RestaurantService } from "../../../services/restaurant.service";
import { RestaurantMongoRepository } from "../../../repository/restaurant.repository";
import { HttpException } from "../../../exceptions/http-exceptions";
import { createRestaurantDTO, UpdateRestaurantDTO } from "../../../dtos/restaurant.dtos";

jest.mock("../../../repository/restaurant.repository");

describe("RestaurantService", () => {
    let restaurantService: RestaurantService;
    let mockRestaurantRepo: jest.Mocked<RestaurantMongoRepository>;

    beforeEach(() => {
        restaurantService = new RestaurantService();
        mockRestaurantRepo = RestaurantMongoRepository.prototype as jest.Mocked<RestaurantMongoRepository>;
        jest.clearAllMocks();
    });

    const validUserId = new mongoose.Types.ObjectId();
    const validRestaurantId = new mongoose.Types.ObjectId();

    const mockRestaurant = {
        _id: validRestaurantId,
        userId: validUserId,
        restaurantName: "Test Restaurant",
        description: "Delicious test food",
        location: "Kathmandu",
        status: true,
        openingHours: "09:00 AM - 10:00 PM",
        foodTypes: ["Momo", "Burger"],
        createdAt: new Date(),
        updatedAt: new Date(),
    } as any;

    describe("createRestaurant", () => {
        const createData: createRestaurantDTO = {
            restaurantName: "Test Restaurant",
            description: "Delicious test food",
            location: "Kathmandu",
            status: true,
            openingHours: "09:00 AM - 10:00 PM",
            foodTypes: ["Momo", "Burger"],
        };

        it("should successfully create a new restaurant profile", async () => {
            mockRestaurantRepo.findByUserId.mockResolvedValue(null);
            mockRestaurantRepo.createRestaurant.mockResolvedValue(mockRestaurant);

            const result = await restaurantService.createRestaurant({ ...createData, userId: validUserId.toString() });

            expect(mockRestaurantRepo.findByUserId).toHaveBeenCalledWith(validUserId.toString());
            expect(mockRestaurantRepo.createRestaurant).toHaveBeenCalledWith({
                ...createData,
                userId: validUserId.toString(),
            });
            expect(result).toEqual(mockRestaurant);
        });

        it("should throw 400 if a restaurant profile already exists for the user", async () => {
            mockRestaurantRepo.findByUserId.mockResolvedValue(mockRestaurant);

            await expect(restaurantService.createRestaurant({ ...createData, userId: validUserId.toString() }))
                .rejects.toThrow(HttpException);
        });
    });

    describe("getRestaurantById", () => {
        it("should return restaurant when found", async () => {
            mockRestaurantRepo.findById.mockResolvedValue(mockRestaurant);

            const result = await restaurantService.getRestaurantById(validRestaurantId.toString());

            expect(mockRestaurantRepo.findById).toHaveBeenCalledWith(validRestaurantId.toString());
            expect(result).toEqual(mockRestaurant);
        });

        it("should throw 404 if restaurant not found", async () => {
            mockRestaurantRepo.findById.mockResolvedValue(null);

            await expect(restaurantService.getRestaurantById("nonexistent"))
                .rejects.toMatchObject({
                    status: 404,
                    message: "Restaurant not found",
                });
        });
    });

    describe("getAllRestaurants", () => {
        it("should return all restaurants", async () => {
            mockRestaurantRepo.findAll.mockResolvedValue([mockRestaurant]);

            const result = await restaurantService.getAllRestaurants();

            expect(mockRestaurantRepo.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockRestaurant]);
        });
    });

    describe("getRestaurantByUserId", () => {
        it("should return restaurant by userId", async () => {
            mockRestaurantRepo.findByUserId.mockResolvedValue(mockRestaurant);

            const result = await restaurantService.getRestaurantByUserId(validUserId.toString());

            expect(mockRestaurantRepo.findByUserId).toHaveBeenCalledWith(validUserId.toString());
            expect(result).toEqual(mockRestaurant);
        });

        it("should throw 404 if no restaurant found for user", async () => {
            mockRestaurantRepo.findByUserId.mockResolvedValue(null);

            await expect(restaurantService.getRestaurantByUserId(validUserId.toString()))
                .rejects.toMatchObject({
                    status: 404,
                    message: "Restaurant not found for this user",
                });
        });
    });

    describe("updateRestaurant", () => {
        const updateData: UpdateRestaurantDTO = {
            restaurantName: "Updated Name",
            description: "Updated Description",
        };

        it("should update restaurant successfully", async () => {
            mockRestaurantRepo.findById.mockResolvedValue(mockRestaurant);
            mockRestaurantRepo.update.mockResolvedValue({ ...mockRestaurant, ...updateData } as any);

            const result = await restaurantService.updateRestaurant(validRestaurantId.toString(), updateData);

            expect(mockRestaurantRepo.findById).toHaveBeenCalledWith(validRestaurantId.toString());
            expect(mockRestaurantRepo.update).toHaveBeenCalledWith(validRestaurantId.toString(), updateData);
            expect(result).toBeDefined();
        });

        it("should throw 404 if restaurant does not exist", async () => {
            mockRestaurantRepo.findById.mockResolvedValue(null);

            await expect(restaurantService.updateRestaurant("invalid", updateData))
                .rejects.toMatchObject({
                    status: 404,
                    message: "Restaurant not found",
                });
        });

        it("should throw 500 if update fails", async () => {
            mockRestaurantRepo.findById.mockResolvedValue(mockRestaurant);
            mockRestaurantRepo.update.mockResolvedValue(null);

            await expect(restaurantService.updateRestaurant(validRestaurantId.toString(), updateData))
                .rejects.toMatchObject({
                    status: 500,
                    message: "Failed to update restaurant",
                });
        });
    });

    describe("deleteRestaurant", () => {
        it("should delete restaurant successfully", async () => {
            mockRestaurantRepo.findById.mockResolvedValue(mockRestaurant);
            mockRestaurantRepo.delete.mockResolvedValue(true);

            const result = await restaurantService.deleteRestaurant(validRestaurantId.toString());

            expect(mockRestaurantRepo.findById).toHaveBeenCalledWith(validRestaurantId.toString());
            expect(mockRestaurantRepo.delete).toHaveBeenCalledWith(validRestaurantId.toString());
            expect(result).toBe(true);
        });

        it("should throw 404 if restaurant does not exist to delete", async () => {
            mockRestaurantRepo.findById.mockResolvedValue(null);

            await expect(restaurantService.deleteRestaurant("invalid"))
                .rejects.toMatchObject({
                    status: 404,
                    message: "Restaurant not found",
                });
        });
    });
});
