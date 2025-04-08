import { Router } from "express";
import { completeOrder, confirmOrderBySupplier, createOrder, getAllOrders, getCountPages, getOrdersForSupplier } from "../controllers/order.js";
import { AuthMiddleware } from "../middlewares/token.js";

const router = Router();

/**
 * Handles order routes, including creation, status updates, and fetching orders,
 * with role-based access for admin and supplier.
 */
router.get("/", AuthMiddleware(["admin"]), getAllOrders);
router.get("/supplierOrders", AuthMiddleware(["supplier"]), getOrdersForSupplier);
router.get("/totalPages", getCountPages);
router.post("/", AuthMiddleware(["admin"]), createOrder);
/**
 * Although it was stated that only retrieval and insertion actions are required,
 * updating the status of an order involves modifying existing data,
 * and is therefore implemented using PUT in accordance with RESTful API principles. 
 */
router.put("/completed/:id", AuthMiddleware(["admin"]), completeOrder);
router.put("/:id", AuthMiddleware(["supplier"]), confirmOrderBySupplier);

export default router;