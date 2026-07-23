import mongoose, { Document, Schema } from 'mongoose';
import { UserType } from '../types/user.types';

export interface IUser extends UserType, Document {

    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const userModelSchema: Schema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["customer", "driver", "restaurant","admin"], required: true },
    password: { type: String, required: true, unique: false },
    address:{type:String,required:false},
  imageUrl:{type:String,required:false},
  phoneNumber:{type:String,required:true},
},
    {
        timestamps: true,
    }
);

export default mongoose.model<IUser>(
    "User",
    userModelSchema
)