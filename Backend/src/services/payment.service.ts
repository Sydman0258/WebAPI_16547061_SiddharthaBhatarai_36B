import { HttpException } from "../exceptions/http-exceptions";
import { PaymentMongoRepository } from "../repository/payment.repository";
import { OrderMongoRepository } from "../repository/order.repository";
import {
    createCardDTO,
    createEsewaDTO,
    initiateEsewaDTO,
    updatePaymentDTO,
    verifyEsewaDTO,
} from "../dtos/payment.dtos";
import mongoose from "mongoose";
import { initiateEsewaPayment as generateEsewaPayment } from "./esewa.service";
import { checkEsewaTransactionStatus } from "./esewa.service";
import { esewaConfig } from "../config/esewa.config";
import { verifyEsewaResponseSignature } from "../utils/esewa.utils";

const paymentRepository = new PaymentMongoRepository();
const orderRepository = new OrderMongoRepository();

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

async initiateEsewaPayment(orderId: string, clientOrigin?: string) {
  const order = await orderRepository.findById(orderId);

  if (!order) {
    throw new HttpException(404, "Order not found");
  }

  if (order.paymentMethod !== "esewa") {
    throw new HttpException(
      400,
      "Order is not configured for eSewa payment"
    );
  }

  const payload = generateEsewaPayment(
    orderId,
    Number(order.total).toFixed(2),
    clientOrigin
  );

  await orderRepository.update(orderId, {
    esewaTransactionUuid: payload.transaction_uuid,
    paymentStatus: "pending",
  });

  return payload;
}

  async verifyEsewaPayment(encodedData: string) {
  try {
    const decodedData = Buffer.from(encodedData, "base64").toString("utf-8");
    const parsedData = JSON.parse(decodedData);

    if (!verifyEsewaResponseSignature(parsedData)) {
      throw new HttpException(400, "Invalid eSewa callback signature");
    }

    const {
      transaction_uuid,
      transaction_code,
      status,
      total_amount,
      product_code,
    } = parsedData;

    if (status !== "COMPLETE" || product_code !== esewaConfig.productCode) {
      throw new HttpException(400, "Invalid eSewa payment response");
    }

    const esewaStatus = await checkEsewaTransactionStatus({
      transactionUuid: transaction_uuid,
      totalAmount: Number(total_amount),
    });

    if (esewaStatus.status !== "COMPLETE") {
      throw new HttpException(400, "Payment not completed");
    }

    const uuidParts = String(transaction_uuid).split("-");

    if (uuidParts.length < 3) {
      throw new HttpException(400, "Invalid transaction UUID format");
    }

    const orderId = uuidParts[1];
    const order = await orderRepository.findById(orderId);

    if (!order) {
      throw new HttpException(404, "Order not found");
    }

    const expectedAmount = Number(order.total);

    if (
      order.esewaTransactionUuid !== transaction_uuid ||
      Number(total_amount) !== expectedAmount ||
      esewaStatus.transactionUuid !== transaction_uuid ||
      esewaStatus.productCode !== esewaConfig.productCode ||
      esewaStatus.totalAmount !== expectedAmount
    ) {
      throw new HttpException(
        400,
        "eSewa payment details do not match the order"
      );
    }

    await orderRepository.update(orderId, {
      paymentStatus: "paid",
      paymentMethod: "esewa",
      transactionId: transaction_code,
      paidAt: new Date(),
    });

    return {
      success: true,
      message: "Payment verified successfully",
      data: {
        orderId,
        status: esewaStatus.status,
        referenceId: esewaStatus.referenceId,
      },
    };
  } catch (error: any) {
    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      400,
      error.message || "Payment verification failed"
    );
  }
}
}