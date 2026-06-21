import z from "zod";
import { createDriverDTO, updateDriverDTO } from "../dtos/driver.dtos";
import { HttpException } from "../exceptions/http-exceptions";
import { DriverService } from "../services/driver.service";
import { ApiResponseHelper } from "../utils/api-response";
import { Response, Request } from "express";

const driverService = new DriverService();

export class DriverController {

    async createDriver(req: Request, res: Response) {
        try {
            const parseResult = createDriverDTO.safeParse(req.body);
            if (!parseResult.success) {
                throw new HttpException(400, z.prettifyError(parseResult.error));
            }
            const userId = req.user?._id;
            if (!userId) throw new HttpException(401, "Unauthorized");

            const driver = await driverService.createDriver(userId, parseResult.data);
            return ApiResponseHelper.success(res, driver, true, 201, "Driver profile created");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to create driver", err?.status || 500);
        }
    }

    async getMyDriver(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if (!userId) throw new HttpException(401, "Unauthorized");

            const driver = await driverService.getDriverByUserId(userId);
            return ApiResponseHelper.success(res, driver, true, 200, "Driver profile retrieved");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to get driver", err?.status || 500);
        }
    }

    async getDriverById(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const driver = await driverService.getDriverById(id);
            return ApiResponseHelper.success(res, driver, true, 200, "Driver retrieved");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to get driver", err?.status || 500);
        }
    }

    async getAllDrivers(req: Request, res: Response) {
        try {
            const drivers = await driverService.getAllDrivers();
            return ApiResponseHelper.success(res, drivers, true, 200, "Drivers retrieved");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to get drivers", err?.status || 500);
        }
    }

    async getAvailableDrivers(req: Request, res: Response) {
        try {
            const drivers = await driverService.getAvailableDrivers();
            return ApiResponseHelper.success(res, drivers, true, 200, "Available drivers retrieved");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to get available drivers", err?.status || 500);
        }
    }

    async updateDriver(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const parseResult = updateDriverDTO.safeParse(req.body);
            if (!parseResult.success) {
                throw new HttpException(400, z.prettifyError(parseResult.error));
            }
            const updated = await driverService.updateDriver(id, parseResult.data);
            return ApiResponseHelper.success(res, updated, true, 200, "Driver updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to update driver", err?.status || 500);
        }
    }

    async toggleAvailability(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if (!userId) throw new HttpException(401, "Unauthorized");

            const driver = await driverService.getDriverByUserId(userId);
            const updated = await driverService.toggleAvailability(driver._id.toString());
            return ApiResponseHelper.success(res, updated, true, 200, "Availability toggled");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to toggle availability", err?.status || 500);
        }
    }

    async deleteDriver(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            await driverService.deleteDriver(id);
            return ApiResponseHelper.success(res, null, true, 200, "Driver deleted");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to delete driver", err?.status || 500);
        }
    }
}