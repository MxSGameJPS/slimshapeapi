const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET /api/medicos - Lista todos os médicos
// POST /api/medicos - Cria um novo médico
// PUT /api/medicos/:id - Atualiza um médico
// DELETE /api/medicos/:id - Remove um médico

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await pool.query("SELECT * FROM medicos ORDER BY id");
      return res.status(200).json(result.rows);
    } catch (e) {
      return res.status(500).json({ error: "Erro ao buscar médicos" });
    }
  }
  if (req.method === "POST") {
    const { nome, crm } = req.body;
    if (!nome || !crm)
      return res.status(400).json({ error: "Nome e CRM obrigatórios" });
    try {
      const result = await pool.query(
        "INSERT INTO medicos (nome, crm) VALUES ($1, $2) RETURNING *",
        [nome, crm]
      );
      return res.status(201).json(result.rows[0]);
    } catch (e) {
      return res.status(500).json({ error: "Erro ao criar médico" });
    }
  }
  if (req.method === "PUT") {
    const { id, nome, crm } = req.body;
    if (!id || !nome || !crm)
      return res.status(400).json({ error: "Id, nome e CRM obrigatórios" });
    try {
      const result = await pool.query(
        "UPDATE medicos SET nome = $1, crm = $2 WHERE id = $3 RETURNING *",
        [nome, crm, id]
      );
      if (result.rowCount === 0)
        return res.status(404).json({ error: "Médico não encontrado" });
      return res.status(200).json(result.rows[0]);
    } catch (e) {
      return res.status(500).json({ error: "Erro ao atualizar médico" });
    }
  }
  if (req.method === "DELETE") {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "Id obrigatório" });
    try {
      const result = await pool.query("DELETE FROM medicos WHERE id = $1", [
        id,
      ]);
      if (result.rowCount === 0)
        return res.status(404).json({ error: "Médico não encontrado" });
      return res.status(204).end();
    } catch (e) {
      return res.status(500).json({ error: "Erro ao remover médico" });
    }
  }
  return res.status(405).json({ error: "Método não permitido" });
};
