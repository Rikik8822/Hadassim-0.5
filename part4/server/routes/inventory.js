import { Router } from "express";
import { handlePurchaseFromRegister, getInventory } from "../controllers/inventory.js";


const router = Router();

router.post("/", handlePurchaseFromRegister);
router.get("/", getInventory);



export default router;