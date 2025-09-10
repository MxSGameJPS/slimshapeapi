import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../src/utils/prisma";
import { authenticateAdmin } from "../../src/middlewares/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    // Autenticação JWT
    const auth = await authenticateAdmin(req, res);
    if (!auth) return;

    // Simula planos ativos por paciente
    const pacientes = await prisma.paciente.findMany();
    const planos = pacientes.map((p) => ({
      pacienteId: p.id,
      nome: p.nome,
      progresso: "em andamento",
      valor: 499.9,
      status: "ativo",
    }));
    return res.json({ data: planos });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar planos" });
  }
}
