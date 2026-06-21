import mongoose, { Document ,model,Schema} from "mongoose";
import { RestaurantType } from "../types/restaurant.types";

export interface  IRestaurant extends Omit< RestaurantType,'userId'>,Document{

    userId:mongoose.Types.ObjectId;
}

const  restaurantModelSchema:Schema=new Schema<IRestaurant>({

userId:{type:Schema.Types.ObjectId,required:true,ref:"User"},
restaurantName:{type:String,required:true},
description:{type:String,required:true},
location:{type:String,required:true},
status:{type:String,required:true},
openingHours:{type:String,required:true},
restaurantImage:{type:String,required:false},
foodTypes:{type:[String],required:true},


},{
    timestamps:true
});

export default model<IRestaurant>("Restaurant", restaurantModelSchema);