const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET /api/pagamento-status/:pacienteId
module.exports = async function handler(req, res) {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://slimshape-three.vercel.app",
    "https://slimshapeapi.vercel.app",
    "https://www.slimshapedigital.com.br",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  const { pacienteId } = req.query;
  if (!pacienteId) {
    res.status(400).json({ error: "Informe o pacienteId na URL" });
    return;
  }

  try {
    // Supondo que existe um campo status_pagamento na tabela pacientes
    const result = await pool.query(
      "SELECT status_pagamento FROM pacientes WHERE id = $1",
      [pacienteId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Paciente não encontrado" });
      return;
    }
    res.json({ status: result.rows[0].status_pagamento });
  } catch (e) {
    res.status(500).json({ error: "Erro ao buscar status do pagamento" });
  }
};
