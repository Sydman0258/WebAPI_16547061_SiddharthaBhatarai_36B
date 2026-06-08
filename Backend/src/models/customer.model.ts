import mongoose, { Document, Schema } from 'mongoose';
import { CustomerType } from '../types/customer.types';

export interface ICustomer extends CustomerType, Document {

    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const customerModelSchema: Schema = new Schema<ICustomer>({
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["customer", "driver", "restaurant"], required: true },
    password: { type: String, required: true, unique: true }
},
    {
        timestamps: true,
    }
);

export default mongoose.model<ICustomer>(
    "Customer",
    customerModelSchema
)