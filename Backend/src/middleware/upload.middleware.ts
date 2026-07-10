import multer from "multer";
import path from "path";
import { Request } from "express";
import { HttpException } from "../exceptions/http-exceptions";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

function getUploadFolder(req: Request, file: Express.Multer.File) {
    const routePath = req.originalUrl.toLowerCase();
    const fieldName = file.fieldname?.toLowerCase() || "";

    if (routePath.includes("/restaurant") || fieldName.includes("restaurant")) {
        return "restaurant";
    }

    if (routePath.includes("/menu") || fieldName.includes("item") || fieldName.includes("menu")) {
        return "menu";
    }

    if (routePath.includes("/user") || routePath.includes("/admin") || fieldName.includes("profile")) {
        return "user";
    }

    return "general";
}

const storage = multer.diskStorage(
    {
        destination: (
            req: Request,
            file: Express.Multer.File,
            cb: (error: Error | null, destination: string) => void
        ) => {
            const folder = getUploadFolder(req, file);
            const uploadPath = path.join(__dirname, "../../uploads", folder);

            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: (
            req: Request,
            file: Express.Multer.File,
            cb: (error: Error | null, filename: string) => void
        ) => {
            const fileSuffix = uuidv4();
            cb(null, `${fileSuffix}-${file.originalname}`);
        }
    }
);

const fileFilter = (
    req: Request, 
    file: Express.Multer.File, 
    cb: multer.FileFilterCallback
) => {
    if (
        file.mimetype === "image/jpeg" || 
        file.mimetype === "image/png"
    ) {
        cb(null, true); // accept file
    } else {
        cb(new HttpException(400, "Only JPEG and PNG files are allowed")); // reject file
    }
}
const upload = multer(
    {
        storage,
        limits: {
            fileSize: 1024 * 1024 * 5 // 5MB limit
        },
        fileFilter
    }
);

export const uploads = {
    single: (
        fieldName: string
    ) => upload.single(fieldName),
    array: (
        fieldName: string, 
        maxCount: number
    ) => upload.array(fieldName, maxCount),
    fields: (
        fieldsArray: {
            name: string, 
            maxCount?: number 
        }[]
    ) => upload.fields(fieldsArray)
}