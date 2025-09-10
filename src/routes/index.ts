// Rotas principais do backend Slim Shape Digital
import { Router } from "express";
import preCadastroRoutes from "./preCadastroRoutes";
// import pacientesRoutes from './pacientesRoutes';
// import injecoesRoutes from './injecoesRoutes';
// import planosRoutes from './planosRoutes';
// import analisesRoutes from './analisesRoutes';
import adminRoutes from "./adminRoutes";
import authRoutes from "./authRoutes";

const router = Router();

router.use("/", preCadastroRoutes);
router.use("/api", adminRoutes);
router.use("/api", authRoutes);
// router.use('/pacientes', pacientesRoutes);
// router.use('/injecoes', injecoesRoutes);
// router.use('/planos', planosRoutes);
// router.use('/analises', analisesRoutes);
// router.use('/admin', adminRoutes);

export default router;
