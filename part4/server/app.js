import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import orderRouter from "./routes/order.js"
import userRouter from "./routes/user.js"
import purchaseRouter from "./routes/inventory.js"
import productRouter from "./routes/product.js"

/**
 * Initializes the Express server, connects to the database,
 * sets up middleware, and mounts route handlers.
 */

const app = express();

config();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter)
app.use("/api/order", orderRouter)
app.use("/api/purchase", purchaseRouter)
app.use("/api/products", productRouter)




let port = process.env.PORT;
app.listen(port, () => console.log(`app is listening on port ${port}`));