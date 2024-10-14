import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const CONNECTION_URL = process.env.CONNECTION_URL;

const connectToMongoDB = async () => {
    mongoose.connect(CONNECTION_URL)
        .then(() => console.log("Connected to MongoDB"))
        .catch((error) => console.log(error.message));
}

export default connectToMongoDB;