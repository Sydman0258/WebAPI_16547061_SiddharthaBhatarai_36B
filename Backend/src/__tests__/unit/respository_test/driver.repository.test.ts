import "../../../models/user.model";

import  Driver  from "../../../models/driver.model";

import mongoose from "mongoose";
import { DriverMongoRepository } from "../../../repository/driver.repository";

describe("DriverMongoRepository", () => {
  let repository: DriverMongoRepository;

  beforeEach(() => {
    repository = new DriverMongoRepository();
  });

  test("should create a new driver", async () => {
    const driverData = {
      userId: new mongoose.Types.ObjectId(),
      vehicleType: "Bike",
      vehicleNumber: "BA-1234",
      currentLocation: "Kathmandu",
      isAvailable: true,
    };

    const created = await repository.create(driverData as any);

    expect(created).toBeDefined();
    expect(created.vehicleType).toBe("Bike");
    expect(created.currentLocation).toBe("Kathmandu");
  });

  test("should find driver by ID", async () => {
    const createdDriver = await Driver.create({
      userId: new mongoose.Types.ObjectId(),
      vehicleType: "Bike",
      vehicleNumber: "BA-1234",
      currentLocation: "Lalitpur",
      isAvailable: true,
    });

    const found = await repository.findById(createdDriver._id.toString());

    expect(found).not.toBeNull();
    expect(found?._id.toString()).toBe(createdDriver._id.toString());
  });

  test("should find driver by userId", async () => {
    const userId = new mongoose.Types.ObjectId();
    await Driver.create({
      userId,
      vehicleType: "Car",
      vehicleNumber: "LU-5678",
      currentLocation: "Bhaktapur",
      isAvailable: true,
    });

    const found = await repository.findByUserId(userId.toString());

    expect(found).not.toBeNull();
    expect(found?.vehicleType).toBe("Car");
  });

  test("should find available drivers only", async () => {
    await Driver.create([
      {
        userId: new mongoose.Types.ObjectId(),
        vehicleType: "Bike",
        vehicleNumber: "BA-1111",
        currentLocation: "Thamel",
        isAvailable: true,
      },
      {
        userId: new mongoose.Types.ObjectId(),
        vehicleType: "Car",
        vehicleNumber: "BA-2222",
        currentLocation: "Patan",
        isAvailable: false,
      },
    ]);

    const availableDrivers = await repository.findAvailable();

    expect(availableDrivers.length).toBeGreaterThanOrEqual(1);
    expect(availableDrivers.every((d) => d.isAvailable)).toBe(true);
  });

  test("should update a driver", async () => {
    const createdDriver = await Driver.create({
      userId: new mongoose.Types.ObjectId(),
      vehicleType: "Bike",
      vehicleNumber: "BA-3333",
      currentLocation: "Pokhara",
      isAvailable: true,
    });

    const updated = await repository.update(createdDriver._id.toString(), {
      currentLocation: "Chitwan",
      isAvailable: false,
    });

    expect(updated).not.toBeNull();
    expect(updated?.currentLocation).toBe("Chitwan");
    expect(updated?.isAvailable).toBe(false);
  });

  test("should delete a driver", async () => {
    const createdDriver = await Driver.create({
      userId: new mongoose.Types.ObjectId(),
      vehicleType: "Bicycle",
      vehicleNumber: "N/A",
      currentLocation: "Dharan",
      isAvailable: true,
    });

    const deleted = await repository.delete(createdDriver._id.toString());

    expect(deleted).not.toBeNull();

    const foundAfterDelete = await Driver.findById(createdDriver._id);
    expect(foundAfterDelete).toBeNull();
  });
});