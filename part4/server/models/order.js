import mongoose from "mongoose"

const minProductSchema = new mongoose.Schema({
    productName: String,
    price: Number,
    qty: Number
})

const orderSchema = new mongoose.Schema({
    status: { type: String, enum: ["pending", "in_process", "completed", "cancelled"], default: "pending" },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [minProductSchema],
    totalPrice: Number,
}, { timestamps: true });


export const OrderModel = mongoose.model("Order", orderSchema);