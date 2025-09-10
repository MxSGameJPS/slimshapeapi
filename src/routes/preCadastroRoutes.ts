import { Router } from "express";
import multer from "multer";
import { preCadastro } from "../controllers/preCadastroController";

const router = Router();

// Configuração do multer para múltiplos campos de arquivos
const upload = multer({ dest: "uploads/" });

router.post(
  "/pre-cadastro",
  upload.fields([
    { name: "examesArquivos", maxCount: 10 },
    { name: "diagnosticosArquivos", maxCount: 10 },
  ]),
  preCadastro
);

export default router;
