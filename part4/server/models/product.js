import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    productName: String,
    price: Number,
    minQty: Number,
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const ProductModel = mongoose.model("Product", productSchema);