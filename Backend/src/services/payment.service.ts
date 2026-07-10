import { HttpException } from "../exceptions/http-exceptions";
import { PaymentMongoRepository } from "../repository/payment.repository";
import {
    createCardDTO,
    createEsewaDTO,
    initiateEsewaDTO,
    updatePaymentDTO,
} from "../dtos/payment.dtos";
import mongoose from "mongoose";

const paymentRepository = new PaymentMongoRepository();

export class PaymentService {

    async addCard(userId: string, data: createCardDTO) {

        if (data.isDefault) {
            const currentDefault = await paymentRepository.findDefault(userId);

            if (currentDefault) {
                await paymentRepository.update(currentDefault._id.toString(), {
                    isDefault: false,
                });
            }
        }

        return await paymentRepository.create({
            userId:new mongoose.Types.ObjectId(userId),
            paymentType: "card",
            card: {
                cardHolderName: data.cardHolderName,
                cardBrand: data.cardBrand,
                cardNumber: data.cardNumber,
                expiryMonth: data.expiryMonth,
                expiryYear: data.expiryYear,
            },
            isDefault: data.isDefault ?? false,
        });
    }

    async addEsewaAccount(userId: string, data: createEsewaDTO) {

        if (data.isDefault) {
            const currentDefault = await paymentRepository.findDefault(userId);

            if (currentDefault) {
                await paymentRepository.update(currentDefault._id.toString(), {
                    isDefault: false,
                });
            }
        }

        return await paymentRepository.create({
            userId:new mongoose.Types.ObjectId(userId),
            paymentType: "esewa",
            esewa: {
                accountName: data.accountName,
                mobileNumber: data.mobileNumber,
            },
            isDefault: data.isDefault ?? false,
        });
    }

    async getPayments(userId: string) {
        return await paymentRepository.findByUserId(userId);
    }

    async getPaymentById(id: string) {
        const payment = await paymentRepository.findById(id);

        if (!payment) {
            throw new HttpException(404, "Payment method not found");
        }

        return payment;
    }

    async updatePayment(id: string, data: updatePaymentDTO) {

        const payment = await paymentRepository.findById(id);

        if (!payment) {
            throw new HttpException(404, "Payment method not found");
        }

        if (data.isDefault) {
            await paymentRepository.setDefault(
                id,
                payment.userId.toString()
            );
        }

        return await paymentRepository.update(id, data);
    }

    async deletePayment(id: string) {

        const payment = await paymentRepository.findById(id);

        if (!payment) {
            throw new HttpException(404, "Payment method not found");
        }

        await paymentRepository.delete(id);

        return {
            message: "Payment method deleted successfully",
        };
    }

    async setDefaultPayment(id: string) {

        const payment = await paymentRepository.findById(id);

        if (!payment) {
            throw new HttpException(404, "Payment method not found");
        }

        return await paymentRepository.setDefault(
            id,
            payment.userId.toString()
        );
    }
 

}