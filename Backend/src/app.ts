import express,{ Application, NextFunction } from "express";
import userRoute from "./routes/user.route";
import { Request,Response } from "express";
import { HttpException } from "./exceptions/http-exceptions";
import { ApiResponseHelper } from "./utils/api-response";
import cors from 'cors';
import path from "path";
import restaurantRoute from "./routes/restaurant.route";
import driverRoute from "./routes/drivers.route";

import menuItemRoute from "./routes/menu.route";
import orderRoute from "./routes/order.route";
import reviewRoute from "./routes/review.route";
import adminUserRoutes from "./routes/admin/user.route";
import paymentRoutes from "./routes/payment.routes";
import aiRoutes from "./routes/ollama.route"



const app:Application=express();
let corsOption={
    origin:"*",
    optionsSuccessStatus:200
}

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/api/v1/customer",userRoute);
app.use("/api/v1/admin/", adminUserRoutes); 

app.use("/api/v1/restaurant",restaurantRoute);
app.use("/api/v1/driver", driverRoute);
app.use("/api/v1/menu", menuItemRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/ai", aiRoutes);

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