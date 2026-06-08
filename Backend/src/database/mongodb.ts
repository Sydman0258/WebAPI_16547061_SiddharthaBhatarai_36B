import mongoose from "mongoose";
import { MONGO_URL } from "../config/constant";

export const connectToMongoose = async () => {

    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected To MongoDB")
    }
    catch (e) {
        console.log("Connection Failed", e);
        throw e;
    }

}