import mongoose from "mongoose";
import { DriverService } from "../../../services/driver.service";
import { DriverMongoRepository } from "../../../repository/driver.repository";
import { HttpException } from "../../../exceptions/http-exceptions";
import { createDriverDTO, updateDriverDTO } from "../../../dtos/driver.dtos";

jest.mock("../../../repository/driver.repository");

describe("DriverService", () => {
  let driverService: DriverService;
  let mockDriverRepo: jest.Mocked<DriverMongoRepository>;

  beforeEach(() => {
    driverService = new DriverService();
    mockDriverRepo = DriverMongoRepository.prototype as jest.Mocked<DriverMongoRepository>;
    jest.clearAllMocks();
  });

  const validUserId = new mongoose.Types.ObjectId();
  const validDriverId = new mongoose.Types.ObjectId();

  const baseMockDriver = {
    _id: validDriverId,
    userId: validUserId,
    vehicleType: "Bike" as const,
    vehicleNumber: "BA-1234",
    currentLocation: "Kathmandu, Nepal",
    isAvailable: false,
    isVerified: false,
    ratings: 0,
    totalDeliveries: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDriver = baseMockDriver as any;

  describe("createDriver", () => {
    const createData: createDriverDTO = {
      vehicleType: "Bike",
      vehicleNumber: "BA-1234",
      currentLocation: "Kathmandu, Nepal",
    };

    it("should successfully create a new driver profile", async () => {
      mockDriverRepo.findByUserId.mockResolvedValue(null);
      mockDriverRepo.create.mockResolvedValue(mockDriver);

      const result = await driverService.createDriver(validUserId.toString(), createData);

      expect(mockDriverRepo.findByUserId).toHaveBeenCalledWith(validUserId.toString());
      expect(mockDriverRepo.create).toHaveBeenCalledWith({
        ...createData,
        userId: expect.any(mongoose.Types.ObjectId),
        isAvailable: false,
        isVerified: false,
        ratings: 0,
        totalDeliveries: 0,
      });
      expect(result._id).toBeDefined();
    });

    it("should throw 400 if a driver profile already exists for the user", async () => {
      mockDriverRepo.findByUserId.mockResolvedValue(mockDriver);

      await expect(driverService.createDriver(validUserId.toString(), createData))
        .rejects.toThrow(HttpException);
    });
  });

  describe("getDriverById", () => {
    it("should return driver when found", async () => {
      mockDriverRepo.findById.mockResolvedValue(mockDriver);

      const result = await driverService.getDriverById(validDriverId.toString());

      expect(mockDriverRepo.findById).toHaveBeenCalledWith(validDriverId.toString());
      expect(result).toEqual(mockDriver);
    });

    it("should throw 404 if driver not found", async () => {
      mockDriverRepo.findById.mockResolvedValue(null);

      await expect(driverService.getDriverById("nonexistent"))
        .rejects.toMatchObject({
          status: 404,
          message: "Driver not found",
        });
    });
  });

  describe("getDriverByUserId", () => {
    it("should return driver by userId", async () => {
      mockDriverRepo.findByUserId.mockResolvedValue(mockDriver);

      const result = await driverService.getDriverByUserId(validUserId.toString());

      expect(mockDriverRepo.findByUserId).toHaveBeenCalledWith(validUserId.toString());
      expect(result).toEqual(mockDriver);
    });

    it("should throw 404 if no driver found for user", async () => {
      mockDriverRepo.findByUserId.mockResolvedValue(null);

      await expect(driverService.getDriverByUserId(validUserId.toString()))
        .rejects.toMatchObject({
          status: 404,
          message: "Driver not found for this user",
        });
    });
  });

  describe("getAllDrivers", () => {
    it("should return all drivers", async () => {
      mockDriverRepo.findAll.mockResolvedValue([mockDriver]);

      const result = await driverService.getAllDrivers();

      expect(mockDriverRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockDriver]);
    });
  });

  describe("getAvailableDrivers", () => {
    it("should return available drivers", async () => {
      const available = [{ ...mockDriver, isAvailable: true }];
      mockDriverRepo.findAvailable.mockResolvedValue(available as any);

      const result = await driverService.getAvailableDrivers();

      expect(mockDriverRepo.findAvailable).toHaveBeenCalled();
      expect(result[0].isAvailable).toBe(true);
    });
  });

  describe("updateDriver", () => {
    const updateData: updateDriverDTO = {
      vehicleType: "Car",
      currentLocation: "Pokhara, Nepal",
      isAvailable: true,
    };

    it("should update driver successfully", async () => {
      mockDriverRepo.findById.mockResolvedValue(mockDriver);
      mockDriverRepo.update.mockResolvedValue({ ...mockDriver, ...updateData } as any);

      const result = await driverService.updateDriver(validDriverId.toString(), updateData);

      expect(mockDriverRepo.findById).toHaveBeenCalledWith(validDriverId.toString());
      expect(mockDriverRepo.update).toHaveBeenCalledWith(validDriverId.toString(), updateData);
      expect(result).toBeDefined();
    });

    it("should throw 404 if driver does not exist", async () => {
      mockDriverRepo.findById.mockResolvedValue(null);

      await expect(driverService.updateDriver("invalid", updateData))
        .rejects.toMatchObject({
          status: 404,
          message: "Driver not found",
        });
    });
  });

  describe("toggleAvailability", () => {
    it("should toggle driver availability", async () => {
      mockDriverRepo.findById.mockResolvedValue(mockDriver);
      mockDriverRepo.update.mockResolvedValue({ ...mockDriver, isAvailable: true } as any);

      const result = await driverService.toggleAvailability(validDriverId.toString());

      expect(mockDriverRepo.update).toHaveBeenCalledWith(validDriverId.toString(), { isAvailable: true });
      expect(result.isAvailable).toBe(true);
    });

    it("should throw 404 if driver not found", async () => {
      mockDriverRepo.findById.mockResolvedValue(null);

      await expect(driverService.toggleAvailability("invalid"))
        .rejects.toMatchObject({
          status: 404,
          message: "Driver not found",
        });
    });
  });

  describe("deleteDriver", () => {
    it("should delete driver successfully", async () => {
      mockDriverRepo.findById.mockResolvedValue(mockDriver);
      mockDriverRepo.delete.mockResolvedValue(true);

      const result = await driverService.deleteDriver(validDriverId.toString());

      expect(result).toBe(true);
    });

    it("should throw 404 if driver does not exist", async () => {
      mockDriverRepo.findById.mockResolvedValue(null);

      await expect(driverService.deleteDriver("invalid"))
        .rejects.toMatchObject({
          status: 404,
          message: "Driver not found",
        });
    });
  });
});