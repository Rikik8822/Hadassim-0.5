import { Router } from "express";
import { getAllSupplier, login, register } from "../controllers/user.js";
import { AuthMiddleware } from "../middlewares/token.js";

const router = Router();
/**
 * Handles user routes, including registration, login, and fetching all suppliers,
 * with role-based access for admin.
 */
router.get("/", AuthMiddleware(["admin"]), getAllSupplier);
router.post("/", register);
router.post("/login", login);


export default router;