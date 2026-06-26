import { userService } from "../../services/user.services";
import { z } from "zod";
import { createUserDTO, loginUserDTO, updateUserDTO, UpdatePasswordDTO, CreateUserDTOAdmin } from "../../dtos/user.dtos";
import { ApiResponseHelper } from "../../utils/api-response";
import { Request, Response } from "express";
const UserService = new userService();

interface QueryParams {
    page?: string;
    limit?: string;
    search?: string;
}
export class AdminUserController {
    async createUser(req: Request, res: Response) {
        try {
            const userData = CreateUserDTOAdmin.safeParse(req.body);
            if (!userData.success) {
                return ApiResponseHelper
                    .error(res, z.prettifyError(userData.error), 400);
            }
            const user = await UserService.createUser(userData.data);
            return ApiResponseHelper.success(res, user,true,201, "User created successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const userId = req.params.id as string;

            const userData = updateUserDTO.safeParse(req.body);

            if (!userData.success) {
                return ApiResponseHelper
                    .error(res, z.prettifyError(userData.error), 400);
            }

            if (req.file) {
                userData.data.imageUrl = "/uploads/" + req.file.filename; // add profileImage path to body
            }
            const updatedUser = await UserService.updateUser(userId, userData.data);
            return ApiResponseHelper.success(res, updatedUser,true,200, "User updated successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async updatePassword(req: Request, res: Response) {
        try {
            const userId = req.params.id as string;

            const userData = UpdatePasswordDTO.safeParse(req.body);

            if (!userData.success) {
                return ApiResponseHelper
                    .error(res, z.prettifyError(userData.error), 400);
            }
            const checkPasswordValid = await UserService.checkPassword(userId, userData.data.currentPassword);
            if (!checkPasswordValid) {
                return ApiResponseHelper.error(res, "Current password is incorrect", 400);
            }

            const password = userData.data.newPassword;
            // can use the same service function for updating user, since it can update any field, just pass the new password in the data
            const updatedUser = await UserService.updateUser(userId, { password });

            return ApiResponseHelper.success(res, updatedUser,true,200, "Password updated successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const userId = req.params.id as string;
            const deleted = await UserService.deleteUser(userId);
            if (!deleted) {
                return ApiResponseHelper.error(res, "User not found", 404);
            }
            return ApiResponseHelper.success(res, null,true,200, "User deleted successfully");
        }
        catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const userId = req.params.id as string;
            if (!userId) {
                return ApiResponseHelper.error(res, "User ID is required", 400);
            }
            const user = await UserService.getUserById(userId);
            return ApiResponseHelper.success(res, user,true,200, "User retrieved successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async getAllUserPaginated(req: Request, res: Response) {
        try {
            const { page, limit, search }: QueryParams = req.query;
            const { data, pagination } = await UserService.getAllUserPaginated(page, limit, search);
            
            return ApiResponseHelper.success(res, data,true,200, "Users retrieved successfully", pagination);
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }
}