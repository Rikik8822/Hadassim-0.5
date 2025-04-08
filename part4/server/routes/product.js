import { Router } from "express";
import { getAllProducts } from "../controllers/product.js";

const router = Router();

router.get("/", getAllProducts);


export default router;