import dotenv from 'dotenv';
import { string } from 'zod';
dotenv.config();

export const MONGO_URL = process.env.MONGO_URL as string;
export const PORT=process.env.PORT;
export const JWT_KEY=process.env.JWT_KEY as string;
export const EMAIL_USER=process.env.EMAIL_USER;
export const EMAIL_PASS=process.env.EMAIL_PASS;
export const CLIENT_URL: string =
process.env.CLIENT_URL ;