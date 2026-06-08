import express,{ Application, NextFunction } from "express";
import customerRoute from "./routes/customer.route";
import { Request,Response } from "express";
import { HttpException } from "./exceptions/http-exceptions";
import { ApiResponseHelper } from "./utils/api-response";
import cors from 'cors';

const app:Application=express();
let corsOption={
    origin:"*",
    optionsSuccessStatus:200
}

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/c1/customer",customerRoute);

app.use(
    (req: Request, res: Response) => {
        return res.status(404).json({ message: "Route not found" });
    }
);

app.use(
    (err:Error,req:Request,res:Response,next:NextFunction)=>{
        if(err instanceof HttpException){
            return  ApiResponseHelper.error(
                res,
                err?.message,
                err.status
            );
        }
        return ApiResponseHelper.error(
            res,
            err?.message,
            500
        );
    }
);

export default app;