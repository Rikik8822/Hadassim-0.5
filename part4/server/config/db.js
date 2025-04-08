import { connect } from "mongoose";

/**
 * Connects to the MongoDB database using the provided URI.
 * If the connection fails, the process exits.
 */

export const connectDB = async () => {
    try {
        await connect(process.env.DB_URI);
        console.log("mongo db connected ")
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

}