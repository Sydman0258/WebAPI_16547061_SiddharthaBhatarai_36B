import z from "zod";
import "../../../models/user.model";

import restaurantModel from "../../../models/restaurant.model";

import mongoose from "mongoose";
import { RestaurantMongoRepository } from "../../../repository/restaurant.repository";
import { RestaurantSchema } from "../../../types/restaurant.types";

export const createRestaurantDTO = RestaurantSchema.pick({
  restaurantName: true,
  description: true,
  location: true,
  status: true,
  openingHours: true,
  foodTypes: true,
});

export type createRestaurantDTO = z.infer<typeof createRestaurantDTO>;

export const updateRestaurantDTO = createRestaurantDTO.partial();
export type UpdateRestaurantDTO = z.infer<typeof updateRestaurantDTO>;

// Helper to provide valid default values for required Mongoose fields
const getMockRestaurant = (overrides = {}) => ({
  restaurantName: "Default Resto",
  location: "123 Default St",
  description: "Default description",
  status: true, // Boolean required by your Mongoose schema
  openingHours: "09:00 - 22:00",
  foodTypes: ["Italian"],
  userId: new mongoose.Types.ObjectId(),
  ...overrides,
});

describe("RestaurantMongoRepository", () => {
  const restaurantRepository = new RestaurantMongoRepository();
  const mockUserId = new mongoose.Types.ObjectId().toString();

  beforeEach(async () => {
    await restaurantModel.deleteMany({});
  });

  test("should create a new restaurant", async () => {
    const testRestaurant = getMockRestaurant({
      restaurantName: "Tasty Bites",
      location: "123 Main St",
      description: "Great local food",
      userId: mockUserId,
    });

    const created = await restaurantRepository.createRestaurant(testRestaurant as any);

    expect(created).toBeDefined();
    expect(created).toHaveProperty("_id");
    expect(created.restaurantName).toBe(testRestaurant.restaurantName);
  });

  test("should find restaurant by ID", async () => {
    const createdRestaurant = await restaurantModel.create(
      getMockRestaurant({
        restaurantName: "Diner",
        location: "456 Side St",
        description: "Classic diner",
      })
    );

    expect(createdRestaurant).not.toBeNull();
    const found = await restaurantRepository.findById(createdRestaurant!._id.toString());

    expect(found).not.toBeNull();
    expect(found?._id.toString()).toBe(createdRestaurant!._id.toString());
  });

  test("should find all restaurants", async () => {
    await restaurantModel.create([
      getMockRestaurant({ restaurantName: "Resto 1", location: "Addr 1", description: "Desc 1" }),
      getMockRestaurant({ restaurantName: "Resto 2", location: "Addr 2", description: "Desc 2" }),
    ]);

    const results = await restaurantRepository.findAll();

    expect(results).toHaveLength(2);
  });

  test("should find restaurant by userId", async () => {
    const userId = new mongoose.Types.ObjectId();
    await restaurantModel.create(
      getMockRestaurant({
        restaurantName: "User Resto",
        location: "Addr 3",
        description: "Desc 3",
        userId,
      })
    );

    const found = await restaurantRepository.findByUserId(userId.toString());

    expect(found).not.toBeNull();
    expect(found?.restaurantName).toBe("User Resto");
  });

  test("should update a restaurant", async () => {
    const existing = await restaurantModel.create(
      getMockRestaurant({
        restaurantName: "Old Name",
        location: "Addr 4",
        description: "Desc 4",
      })
    );

    expect(existing).not.toBeNull();
    const updated = await restaurantRepository.update(existing!._id.toString(), {
      restaurantName: "New Name",
    });

    expect(updated).not.toBeNull();
    expect(updated?.restaurantName).toBe("New Name");
  });

  test("should delete a restaurant", async () => {
    const existing = await restaurantModel.create(
      getMockRestaurant({
        restaurantName: "To Delete",
        location: "Addr 5",
        description: "Desc 5",
      })
    );

    expect(existing).not.toBeNull();
    const success = await restaurantRepository.delete(existing!._id.toString());
    const found = await restaurantModel.findById(existing!._id);

    expect(success).toBe(true);
    expect(found).toBeNull();
  });
});