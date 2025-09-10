const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET /api/pacientes - Lista todos os pacientes
// GET /api/pacientes/:id - Busca paciente por id
// POST /api/pacientes - Cria um novo paciente
// PUT /api/pacientes/:id - Atualiza um paciente
// DELETE /api/pacientes/:id - Remove um paciente

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;
    try {
      if (id) {
        const result = await pool.query(
          "SELECT * FROM pacientes WHERE id = $1",
          [id]
        );
        if (result.rows.length === 0)
          return res.status(404).json({ error: "Paciente não encontrado" });
        return res.status(200).json(result.rows[0]);
      } else {
        const result = await pool.query("SELECT * FROM pacientes ORDER BY id");
        return res.status(200).json(result.rows);
      }
    } catch (e) {
      return res.status(500).json({ error: "Erro ao buscar pacientes" });
    }
  }
  if (req.method === "POST") {
    const dados = req.body;
    // Adapte os campos conforme o modelo da tabela pacientes
    try {
      const campos = Object.keys(dados);
      const valores = Object.values(dados);
      const params = campos.map((_, i) => `$${i + 1}`).join(", ");
      const query = `INSERT INTO pacientes (${campos.join(
        ", "
      )}) VALUES (${params}) RETURNING *`;
      const result = await pool.query(query, valores);
      return res.status(201).json(result.rows[0]);
    } catch (e) {
      return res.status(500).json({ error: "Erro ao criar paciente" });
    }
  }
  if (req.method === "PUT") {
    const { id, ...dados } = req.body;
    if (!id) return res.status(400).json({ error: "Id obrigatório" });
    try {
      const campos = Object.keys(dados);
      const valores = Object.values(dados);
      const sets = campos.map((c, i) => `${c} = $${i + 1}`).join(", ");
      const query = `UPDATE pacientes SET ${sets} WHERE id = $${
        campos.length + 1
      } RETURNING *`;
      const result = await pool.query(query, [...valores, id]);
      if (result.rowCount === 0)
        return res.status(404).json({ error: "Paciente não encontrado" });
      return res.status(200).json(result.rows[0]);
    } catch (e) {
      return res.status(500).json({ error: "Erro ao atualizar paciente" });
    }
  }
  if (req.method === "DELETE") {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "Id obrigatório" });
    try {
      const result = await pool.query("DELETE FROM pacientes WHERE id = $1", [
        id,
      ]);
      if (result.rowCount === 0)
        return res.status(404).json({ error: "Paciente não encontrado" });
      return res.status(204).end();
    } catch (e) {
      return res.status(500).json({ error: "Erro ao remover paciente" });
    }
  }
  return res.status(405).json({ error: "Método não permitido" });
};
