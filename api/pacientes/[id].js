const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async function handler(req, res) {
  // CORS para localhost:3000
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  const {
    query: { id },
    method,
    body,
  } = req;

  if (method === "OPTIONS") {
    return res.status(204).end();
  }

  if (!id) {
    return res.status(400).json({ error: "Id obrigatório na URL" });
  }

  if (method === "GET") {
    try {
      const result = await pool.query("SELECT * FROM pacientes WHERE id = $1", [
        id,
      ]);
      if (result.rows.length === 0)
        return res.status(404).json({ error: "Paciente não encontrado" });
      return res.status(200).json(result.rows[0]);
    } catch (e) {
      return res.status(500).json({ error: "Erro ao buscar paciente" });
    }
  }

  if (method === "PUT") {
    const dados = body;
    try {
      const campos = Object.keys(dados);
      const valores = Object.values(dados);
      if (campos.length === 0)
        return res.status(400).json({ error: "Nenhum dado para atualizar" });
      const set = campos.map((c, i) => `${c} = $${i + 2}`).join(", ");
      const query = `UPDATE pacientes SET ${set} WHERE id = $1 RETURNING *`;
      const result = await pool.query(query, [id, ...valores]);
      if (result.rows.length === 0)
        return res.status(404).json({ error: "Paciente não encontrado" });
      return res.status(200).json(result.rows[0]);
    } catch (e) {
      return res.status(500).json({ error: "Erro ao atualizar paciente" });
    }
  }

  if (method === "DELETE") {
    try {
      const result = await pool.query(
        "DELETE FROM pacientes WHERE id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length === 0)
        return res.status(404).json({ error: "Paciente não encontrado" });
      return res.status(204).end();
    } catch (e) {
      return res.status(500).json({ error: "Erro ao remover paciente" });
    }
  }

  res.status(405).json({ error: "Método não permitido" });
};
