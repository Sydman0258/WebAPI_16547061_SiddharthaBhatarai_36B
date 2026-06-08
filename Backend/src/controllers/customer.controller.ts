import z, { success } from "zod";
import { createCustomerDtos, loginCustomerDtos } from "../dtos/customer.dtos";
import { HttpException } from "../exceptions/http-exceptions";
import { customerService } from "../services/customer.services";
import { ApiResponseHelper } from "../utils/api-response";
import { Response,Request } from "express";

const customerservice=new customerService();

export class CustomerController{
    async createCustomer(req:Request,res:Response){
        try {
            const parseResult=createCustomerDtos.safeParse(req.body);
            if(!parseResult.success){
                throw new HttpException(
                    400,
                    z.prettifyError(parseResult.error)
                );
            }
            const createdCustomer=await customerservice.createCustomer(parseResult.data);
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
                err?.message||"Failed To Create Customer",
               err.status|| 201
            );
            
        }
    }
    async loginCustomer(req: Request, res: Response) {
        try{
            const parseResult = loginCustomerDtos.safeParse(req.body);
            if(!parseResult.success){
                throw new HttpException(
                    400, 
                    z.prettifyError(parseResult.error)
                );
            }
            const { customer, token } = await customerservice.loginCustomer(parseResult.data);
           return ApiResponseHelper.success(
    res,
    { customer, token },
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
}