import dotenv from 'dotenv';
import { string } from 'zod';
dotenv.config();

export const MONGO_URL = process.env.MONGO_URL as string;
export const PORT=process.env.PORT;
export const JWT_KEY=process.env.JWT_KEY as string;
export const EMAIL_USER=process.env.EMAIL_USER;
export const EMAIL_PASS=process.env.EMAIL_PASS;
export const MONGODB_USERNAME=process.env.MONGODB_USERNAME;
export const MONGODB_PASSWORD=process.env.MONGODB_PASSWORD;
export const MONGODB_URI=process.env.MONGODB_URI;
export const CLIENT_URL: string =
process.env.CLIENT_URL ;
export const ESEWA_ENVIRONMENT=process.env.ESEWA_ENVIRONMENT;
export const ESEWA_PRODUCT_CODE= process.env.ESEWA_PRODUCT_CODE;
export const ESEWA_SECRET_KEY=process.env.ESEWA_SECRET_KEY;
export const ESEWA_PAYMENT_URL=process.env.ESEWA_PAYMENT_URL;
export const ESEWA_STATUS_URL=process.env.ESEWA_STATUS_URL;
export const ESEWA_RETURN_URL=process.env.ESEWA_RETURN_URL;