const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = async function handler(req, res) {
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
    const query = "SELECT id, email, senha FROM admin WHERE email = $1 LIMIT 1";
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
