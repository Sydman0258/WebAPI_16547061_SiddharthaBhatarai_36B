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

};

export const connectToMongoDBTest = async () => {
    const testUri = "mongodb://localhost:27017/grubgo_test";
    try {
        await mongoose.connect(testUri);
        console.log("Connected to MongoDB Test");
    } catch (error) {
        console.error("Error connecting to MongoDB Test:", error);
        throw error;
    }
};