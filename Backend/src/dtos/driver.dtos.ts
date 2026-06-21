import z from "zod";
import { DriverSchema } from "../types/driver.types";

export const createDriverDTO = DriverSchema.pick({
    vehicleType: true,
    vehicleNumber: true,
    currentLocation: true,
});

export type createDriverDTO = z.infer<typeof createDriverDTO>;

export const updateDriverDTO = DriverSchema.pick({
    vehicleType: true,
    vehicleNumber: true,
    currentLocation: true,
    isAvailable: true,
}).partial();

export type updateDriverDTO = z.infer<typeof updateDriverDTO>;