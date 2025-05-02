import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MongoURI = process.env.MONGOURI;

export const connectToMongo = async () => {
  try {
    await mongoose.connect(MongoURI);
    console.log("Connected to MongoDB!");
  }
  catch(error) {
    console.error("MongoDB connection failed: ", error.message);
    process.exit(1);
  }
};
