// playwright.global.setup.ts
import { connectToMongoDBTest } from "../Backend/src/database/mongodb";
import mongoose from "mongoose";

export default async () => {
  await connectToMongoDBTest();

  const collections = mongoose.connection.collections;

  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }

  await mongoose.disconnect();
};