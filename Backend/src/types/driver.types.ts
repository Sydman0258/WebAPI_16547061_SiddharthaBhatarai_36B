import {z} from "zod";

export const  DriverSchema=z.object({
userId:z.string(),
vehicleType:z.enum(["Car","Bike","Bicycle"]),
vehicleNumber:z.string()||null,
isAvailable:z.boolean(),
currentLocation:z.string(),
isVerified:z.string(),
ratings:z.string(),
totalDeliveries:z.string()
});

export type DriverType=z.infer<typeof DriverSchema>;