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

    // Simula vendas por paciente
    const pacientes = await prisma.paciente.findMany();
    const vendas = pacientes.map((p) => ({
      pacienteId: p.id,
      nome: p.nome,
      quantidade: Math.floor(Math.random() * 10) + 1,
      frequencia: "mensal",
      valor: 299.9,
      status: "pago",
    }));
    return res.json({ data: vendas });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar vendas de injeções" });
  }
}
