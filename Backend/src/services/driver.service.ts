// driver.service.ts
import mongoose from "mongoose";
import { HttpException } from "../exceptions/http-exceptions";
import { DriverMongoRepository } from "../repository/driver.repository";
import { createDriverDTO, updateDriverDTO } from "../dtos/driver.dtos";

const driverRepository = new DriverMongoRepository();

export class DriverService {
    async createDriver(userId: string, data: createDriverDTO) {
        const existing = await driverRepository.findByUserId(userId);
        if (existing) throw new HttpException(400, "A driver profile already exists for this user");

        return await driverRepository.create({
            ...data,
            userId: new mongoose.Types.ObjectId(userId),
            isAvailable: false,
            isVerified: false,
            ratings: 0,
            totalDeliveries: 0,
        });
    }

    async getDriverById(id: string) {
        const driver = await driverRepository.findById(id);
        if (!driver) throw new HttpException(404, "Driver not found");
        return driver;
    }

    async getDriverByUserId(userId: string) {
        const driver = await driverRepository.findByUserId(userId);
        if (!driver) throw new HttpException(404, "Driver not found for this user");
        return driver;
    }

    async getAllDrivers() {
        return await driverRepository.findAll();
    }

    async getAvailableDrivers() {
        return await driverRepository.findAvailable();
    }

    async updateDriver(id: string, data: updateDriverDTO) {
        const driver = await driverRepository.findById(id);
        if (!driver) throw new HttpException(404, "Driver not found");

        const updated = await driverRepository.update(id, data);
        if (!updated) throw new HttpException(500, "Failed to update driver");
        return updated;
    }

    async toggleAvailability(id: string) {
        const driver = await driverRepository.findById(id);
        if (!driver) throw new HttpException(404, "Driver not found");
        return await driverRepository.update(id, { isAvailable: !driver.isAvailable });
    }

    async deleteDriver(id: string) {
        const driver = await driverRepository.findById(id);
        if (!driver) throw new HttpException(404, "Driver not found");
        return await driverRepository.delete(id);
    }
}