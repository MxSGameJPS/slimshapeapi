import { Router } from "express";
import { loginAdmin } from "../controllers/authController";

const router = Router();

router.post("/admin/login", loginAdmin);

export default router;
