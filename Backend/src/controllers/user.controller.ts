import z, { success } from "zod";
import { createUserDTO, loginUserDTO, updateUserDTO } from "../dtos/user.dtos";
import { HttpException } from "../exceptions/http-exceptions";
import { userService } from "../services/user.services";
import { ApiResponseHelper } from "../utils/api-response";
import { Response,Request, NextFunction } from "express";

const userservice=new userService();

export class UserController{
  
    async createUser(req:Request,res:Response){
        try {
            const parseResult=createUserDTO.safeParse(req.body);
            if(!parseResult.success){
                throw new HttpException(
                    400,
                    z.prettifyError(parseResult.error)
                );
            }
            const createdCustomer=await userservice.createUser(parseResult.data);
            return ApiResponseHelper.success(
                res,
                createdCustomer,
                true,
                201,
                "Customer Created"
            );
        } catch (err: Error | unknown | any) {
            return ApiResponseHelper.error(
                res,
                err?.message||"Failed To Create User",
               err.status|| 201
            );
            
        }
    }
    async loginUser(req: Request, res: Response) {
        try{
            const parseResult = loginUserDTO.safeParse(req.body);
            if(!parseResult.success){
                throw new HttpException(
                    400, 
                    z.prettifyError(parseResult.error)
                );
            }
            const { user, token } = await userservice.loginUser(parseResult.data);
           return ApiResponseHelper.success(
    res,
    { user, token },
    true,
    200,
    "Login successful"
);
        }catch(e: Error | unknown | any){
            return ApiResponseHelper.error(
                res, 
                e?.message || "Failed to login user", 
                e.status || 500
            );
        }
    }


    async updateUser(req: Request, res: Response) {
        try{
            const userId = req.user?._id;
            const filename = req.file?.filename;
            const parseResult = updateUserDTO.safeParse(req.body);
            if(!parseResult.success){
                throw new HttpException(
                    400, 
                    z.prettifyError(parseResult.error)
                );
            }
            const updateData = {
                ...parseResult.data,
                ...(filename && { imageUrl: "/uploads/" + filename })
            }
            const updatedUser = await userservice.updateUser(userId, updateData);
            return ApiResponseHelper.success(res, updatedUser, true, 200, "User updated");
        }catch(e: Error | unknown | any){
            return ApiResponseHelper.error(
                res, 
                e?.message || "Failed to update user", 
                e.status || 500
            );
        }
    }

    async getUser(req: Request, res: Response) {
        try{
            const user = req.user;
            if(!user){
                throw new HttpException(401, "Unauthorized");
            }
            return ApiResponseHelper.success(res, user, true, 200, "User info retrieved");
        }catch(e: Error | unknown | any){
            return ApiResponseHelper.error(
                res, 
                e?.message || "Failed to get user info", 
                e.status || 500
            );
        }
    }

}