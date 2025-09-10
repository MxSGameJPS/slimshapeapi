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

    const { page = 1, limit = 20, search = "" } = req.query;
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const where = search
      ? {
          OR: [
            {
              nome: { contains: String(search), mode: "insensitive" as const },
            },
            {
              email: { contains: String(search), mode: "insensitive" as const },
            },
            {
              cidade: {
                contains: String(search),
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const [pacientes, total] = await Promise.all([
      prisma.paciente.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.paciente.count({ where }),
    ]);

    return res.json({
      data: pacientes,
      total,
      page: Number(page),
      limit: take,
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar pacientes" });
  }
}
