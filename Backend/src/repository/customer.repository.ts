import Customer, { ICustomer } from "../models/customer.model";

export interface ICustomerRepository {
    findbyEmail(email: string): Promise<ICustomer | null>;
    createCustomer(customer: ICustomer): Promise<ICustomer>;
    findUsername(username: string): Promise<ICustomer | null>;
}

export class CustomerMongoRepository implements ICustomerRepository {
    async findUsername(username: string): Promise<ICustomer | null> {
        const foundCustomer = await Customer.findOne({ username: username });
        return foundCustomer;
    }
    async findbyEmail(email: string): Promise<ICustomer | null> {
        const foundCustomer = await Customer.findOne({ email: email });
        return foundCustomer;
    }
    async createCustomer(customer: ICustomer): Promise<ICustomer> {
        const createdCustomer = await Customer.create(customer);
        return createdCustomer;
    }

}