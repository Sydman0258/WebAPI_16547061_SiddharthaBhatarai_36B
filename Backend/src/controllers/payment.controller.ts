import { Request, Response, NextFunction } from "express";
import { PaymentService } from "../services/payment.service";
import {
    createCardDTO,
    createEsewaDTO,
    updatePaymentDTO,
    initiateEsewaDTO,
} from "../dtos/payment.dtos";

const paymentService = new PaymentService();

export class PaymentController {

    async addCard(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const data = createCardDTO.parse(req.body);

            const payment = await paymentService.addCard(userId, data);

            res.status(201).json({
                success: true,
                message: "Card added successfully",
                data: payment,
            });
        } catch (error) {
            next(error);
        }
    }

    async addEsewaAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const data = createEsewaDTO.parse(req.body);

            const payment = await paymentService.addEsewaAccount(userId, data);

            res.status(201).json({
                success: true,
                message: "eSewa account added successfully",
                data: payment,
            });
        } catch (error) {
            next(error);
        }
    }

    async getPayments(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;

            const payments = await paymentService.getPayments(userId);

            res.status(200).json({
                success: true,
                data: payments,
            });
        } catch (error) {
            next(error);
        }
    }

    async getPaymentById(req: Request, res: Response, next: NextFunction) {
        try {
            const payment = await paymentService.getPaymentById(req.params.id as string);

            res.status(200).json({
                success: true,
                data: payment,
            });
        } catch (error) {
            next(error);
        }
    }

    async updatePayment(req: Request, res: Response, next: NextFunction) {
        try {
            const data = updatePaymentDTO.parse(req.body);

            const payment = await paymentService.updatePayment(
                req.params.id as string,
                data
            );

            res.status(200).json({
                success: true,
                message: "Payment updated successfully",
                data: payment,
            });
        } catch (error) {
            next(error);
        }
    }

    async setDefaultPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const payment = await paymentService.setDefaultPayment(req.params.id as string);

            res.status(200).json({
                success: true,
                message: "Default payment updated",
                data: payment,
            });
        } catch (error) {
            next(error);
        }
    }

    async deletePayment(req: Request, res: Response, next: NextFunction) {
        try {
            await paymentService.deletePayment(req.params.id as string);

            res.status(200).json({
                success: true,
                message: "Payment deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    async initiateEsewaPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const data = initiateEsewaDTO.parse(req.body);
            const clientOrigin = req.headers["x-client-origin"] as any | undefined;

const payload = await paymentService.initiateEsewaPayment(
  data.orderId,
  clientOrigin
);

            res.status(200).json({
                success: true,
                message: "eSewa payment initiated successfully",
                payload,
            });
        } catch (error) {
            next(error);
        }
    }

    async verifyEsewaPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const { data: encodedData } = req.body;

            if (!encodedData) {
                throw new Error("Encoded payment data is required");
            }

            const result = await paymentService.verifyEsewaPayment(encodedData);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}