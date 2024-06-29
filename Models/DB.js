import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected: " + conn.connection.host);
  } catch (error) {
    if (error.name === "MongoNetworkError") {
      console.log("MongoDB Connection Error: " + error.message);
    } else {
      console.log("MongoDB Connection Error: " + error.message);
    }
  }
};

export default dbConnection;
