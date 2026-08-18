import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) {
    throw new Error("MongoDB connection failed");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log(`[db] connected -> ${mongoose.connection.name}`);
}
