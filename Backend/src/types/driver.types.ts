import {nullable, z} from "zod";

export const  DriverSchema=z.object({
userId:z.string(),
vehicleType:z.enum(["Car","Bike","Bicycle"]),
vehicleNumber:z.string().nullable(),
isAvailable:z.boolean(),
currentLocation:z.string(),
isVerified:z.boolean(),
ratings:z.number(),
totalDeliveries:z.number().int()
});

export type DriverType=z.infer<typeof DriverSchema>;