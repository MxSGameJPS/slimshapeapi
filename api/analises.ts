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

    // Agregações simples para exemplo
    const totalPacientes = await prisma.paciente.count();
    const porEstado = await prisma.paciente.groupBy({
      by: ["estado"],
      _count: { estado: true },
    });
    const porSexo = await prisma.paciente.groupBy({
      by: ["genero"],
      _count: { genero: true },
    });
    // Simula vendas mensais
    const vendasMensais = Array.from({ length: 12 }, (_, i) => ({
      mes: i + 1,
      vendas: Math.floor(Math.random() * 20),
    }));
    return res.json({
      totalPacientes,
      porEstado,
      porSexo,
      vendasMensais,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao gerar análises" });
  }
}
