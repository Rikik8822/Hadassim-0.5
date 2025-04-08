import { OrderModel } from "../models/order.js";
import { UserModel } from "../models/user.js";

/**
 * Creates a new order in the database.
 * Verifies if the supplier exists before creating the order.
 */
export const createOrder = async (req, res) => {
    let { supplier } = req.body;

    try {
        let isSupplier = await UserModel.findById(supplier);
        if (!isSupplier)
            return res.status(404).json({ message: "supplier not found", title: "an error in create order" });
        const newOrder = new OrderModel(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ message: err.message, title: "an error in create order" });
    }
};


/**
 * Retrieves all orders associated with a specific supplier.
 * Filters orders by supplier ID from the request user data.
 */

export const getOrdersForSupplier = async (req, res) => {
    try {
        const supplierId = req.user.userId;
        const orders = await OrderModel.find({ supplier: supplierId })
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message, error: "an error in get orders for supplier" });
    }
};

/**
 * Confirms an order by updating its status to "in_process".
 * Requires the order ID from the route parameters.
 */
export const confirmOrderBySupplier = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await OrderModel.findByIdAndUpdate(orderId, { status: "in_process" }, { new: true });

        if (!order) return res.status(404).json({ message: "Sorry, we couldn't find the order." });


        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: "Oops! Something went wrong while approving the order.", error: err.message });
    }
};

/**
 * Marks an order as "completed".
 * Requires the order ID from the route parameters.
 */

export const completeOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await OrderModel.findByIdAndUpdate(orderId, { status: "completed" }, { new: true });

        if (!order) return res.status(404).json({ message: "Sorry, we couldn't find the order you're looking for." });
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: "Oops! Something went wrong while confirming the order.", error: err.message });
    }
};


/**
 * Retrieves all orders from the database with optional filtering by status, pagination, and limit.
 */

export const getAllOrders = async (req, res) => {
    const { status, limit = 5, page = 1 } = req.query;

    const validStatuses = ["pending", "in_process", "completed", "cancelled"];

    const filter = {};

    if (status && status !== "all") {
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                title: "Invalid status",
                message: `The status '${status}' does not exist. Available statuses are: ${validStatuses.join(", ")}`,
            });
        }
        filter.status = status;
    }

    try {
        const orders = await OrderModel.find(filter).skip((page - 1) * limit).limit(limit);
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({
            title: "Error fatching orders",
            message: err.message,
        });
    }
};

/**
 * Retrieves the total number of pages for orders based on the given limit.
 */

export const getCountPages = async (req, res) => {
    let { limit = 5 } = req.query;
    try {

        let filterObject = {};
        let count = await OrderModel.countDocuments(filterObject);

        let numPages = Math.ceil(count / limit);
        res.json(numPages).status(200)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ title: "an error in getting numPages", message: err.message, })
    }
}

