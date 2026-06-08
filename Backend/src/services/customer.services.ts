import { email } from "zod";
import { createCustomerDtos, loginCustomerDtos } from "../dtos/customer.dtos";
import { HttpException } from "../exceptions/http-exceptions";
import { CustomerMongoRepository } from "../repository/customer.repository";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { JWT_KEY } from "../config/constant";

const customerRepository = new CustomerMongoRepository();

export class customerService {
    async createCustomer(customerData: createCustomerDtos) {
        const existingCustomerbyUsername = await customerRepository.findUsername(customerData.username);
        const existingCustomerbyEmail = await customerRepository.findbyEmail(customerData.email);
        if (existingCustomerbyUsername) {
            throw new HttpException(400, "Username already exists");
        }
        if (existingCustomerbyEmail) {
            throw new HttpException(400, "Email already exista");
        }

        const hashPassword = await bcrypt.hash(customerData.password, 12);
        const customerToCreate = {
            ...customerData, password: hashPassword
        };
        const createdCustomer = await customerRepository.createCustomer(customerToCreate as any);
        return createdCustomer;
    }

    async loginCustomer(loginData: loginCustomerDtos) {
        const customer = await customerRepository.findbyEmail(loginData.email);

        if (!customer) {
            throw new HttpException(400, "User Not Found");
        }
        const isPasswordValid = await bcrypt.compare(
            loginData.password,
            customer.password
        );
        if (!isPasswordValid) {
            throw new HttpException(400, "Password invalid");
        }
        const token = jwt.sign(
            { id: customer._id, email: customer.email, role: customer.role },
            JWT_KEY,
            { expiresIn: "30m" }
        );
        return{token,customer};
    }
}