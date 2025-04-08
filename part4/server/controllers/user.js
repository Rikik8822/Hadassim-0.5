import { ProductModel } from "../models/product.js";
import { UserModel, validatUser } from "../models/user.js"
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcrypt";


/**
 * Retrieves all suppliers, including their merchandise.
 */
export const getAllSupplier = async (req, res) => {
    try {
        let allUsers = await UserModel.find({ role: "supplier" }).populate("merchandise");
        res.json(allUsers);
    }
    catch (err) {
        return res.status(500).json({ message: err.message, title: "An error in getting all users" });
    }
}


/**
 * Registers a new supplier, including creating their products.
 * Validates the user and checks if the email already exists.
 * Hashes the password before saving the user to the database.
 */
export const register = async (req, res) => {
    let { body } = req;

    let validate = validatUser(body);
    if (validate.error)
        return res.status(400).json({ message: validate.error.details });
    try {
        let existingUser = await UserModel.findOne({ email: body.email });
        if (existingUser)
            return res.status(409).json({
                message: "A user with this email already exists. Please try logging in instead.",
                title: "Registration Error"
            });
        let { merchandise, ...userWithoutMerchandise } = body;
        let hashedPassword = await bcrypt.hash(body.password, 10);
        const newSupplier = new UserModel({ ...userWithoutMerchandise, password: hashedPassword });

        await newSupplier.save();

        const createdProducts = await Promise.all(merchandise.map(p => {
            return ProductModel.create({
                productName: p.productName,
                price: p.price,
                minQty: p.minQty,
                supplier: newSupplier._id
            });
        }));

        newSupplier.merchandise = createdProducts.map(p => p._id);
        await newSupplier.save();
        let token = generateToken(newSupplier)
        res.json({ ...newSupplier.toObject(), token });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            title: "Registration Error"
        });
    }

}


/**
 * Logs in an existing user by verifying the email and password.
 * If successful, generates a token for the user.
 */

export const login = async (req, res) => {

    let { body } = req;
    try {
        let user = await UserModel.findOne({ email: body.email });
        if (!user)
            return res.status(404).json({
                message: "No user found with this email address.",
                title: "Login Error"
            });

        let p = await bcrypt.compare(body.password, user.password);
        if (!p)
            return res.status(401).json({
                message: "Incorrect password. Please try again.",
                title: "Login Error"
            });

        let token = generateToken(user)
        res.json({ ...user.toObject(), token });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message,
            title: "Login Error"
        });
    }
}