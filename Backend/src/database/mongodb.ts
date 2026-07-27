import mongoose from "mongoose";
import { MONGO_URL,MONGODB_URI } from "../config/constant";


const uri =
  process.env.NODE_ENV === "production"
    ?MONGODB_URI!
    : MONGO_URL!;

export const connectToMongoose = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
    throw error;
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