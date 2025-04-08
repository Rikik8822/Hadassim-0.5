import { ProductModel } from "../models/product.js";

/**
 * Retrieves all products from the database.
 */

export const getAllProducts = async (req, res) => {
    try {
        let products = await ProductModel.find()
        res.json(products);
    }
    catch (err) {
        return res.status(500).json({ message: err.message, title: "An error in getting products" });
    }
}