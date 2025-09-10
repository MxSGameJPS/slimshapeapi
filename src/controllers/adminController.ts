import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const listarPacientes = async (req: Request, res: Response) => {
  try {
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
};

export const listarInjecoes = async (req: Request, res: Response) => {
  try {
    // Como não há mais tabela Injecao, simula vendas por paciente
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
};

export const listarPlanos = async (req: Request, res: Response) => {
  try {
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
};

export const analises = async (req: Request, res: Response) => {
  try {
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
};
