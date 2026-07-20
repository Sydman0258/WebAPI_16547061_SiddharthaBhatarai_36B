// Consistent API
const res_example = {
    "status": 200,
    "data": {
    },
    "message": "Success",
    "meta": {
        "page": 1,
        "limit": 10,
        "total": 100
    }
}
import { Response } from "express";
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
}
export interface ApiResponse<T> {
    status: number;
    data: T;
    message: string;
    success: boolean;
    meta?: PaginationMeta;
}
export class ApiResponseHelper {
    static success<T>(
        res: Response,
        data: T,
        success: boolean = true,
        status: number = 200,
        message: string = "Success",
        meta?: PaginationMeta
    ) {
        const response: ApiResponse<T> = {
            status,
            success,
            data,
            message,
            meta
        }
        return res.status(status).json(response);
    }
    static error(
        res: Response,
        message: string = "Error",
        status: number = 500
    ) {
        const response: Omit<ApiResponse<any>, 'data'> = {
            status,
            message,
            success: false
        }
        return res.status(status).json(response);
    }
}