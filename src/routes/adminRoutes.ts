import { Router } from "express";
import { authenticateAdmin } from "../middlewares/auth";
import {
  listarPacientes,
  listarInjecoes,
  listarPlanos,
  analises,
} from "../controllers/adminController";

const router = Router();

// Todas as rotas protegidas por autenticação JWT
router.get("/pacientes", authenticateAdmin, listarPacientes);
router.get("/injecoes", authenticateAdmin, listarInjecoes);
router.get("/planos", authenticateAdmin, listarPlanos);
router.get("/analises", authenticateAdmin, analises);

export default router;
