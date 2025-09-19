const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = async function handler(req, res) {
  // CORS dinâmico para localhost e produção
  const allowedOrigins = [
    "http://localhost:3000",
    "https://slimshape-three.vercel.app",
    "https://www.slimshapedigital.com.br",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigins[0]);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  const { usuario, senha } = req.body;
  if (!usuario || !senha) {
    res.status(400).json({ error: "Usuário e senha são obrigatórios" });
    return;
  }

  try {
    // Permite login tanto por email quanto pelo nome 'admin'
    const query =
      "SELECT id, email, senha FROM admin WHERE email = $1 OR email = 'admin' LIMIT 1";
    const values = [usuario];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      res.status(401).json({ error: "Credenciais inválidas" });
      return;
    }
    const admin = result.rows[0];
    if (admin.senha !== senha) {
      res.status(401).json({ error: "Credenciais inválidas" });
      return;
    }
    // Aqui você pode gerar um token JWT real se desejar
    res.status(200).json({
      token: "token_exemplo",
      admin: { id: admin.id, usuario: admin.email, nome: "Administrador" },
    });
  } catch (e) {
    console.error("[ERRO] Falha no login do admin:", e);
    res.status(500).json({ error: "Erro interno ao autenticar" });
  }
};
