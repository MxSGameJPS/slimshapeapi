import { pacientes } from "./db.js";
import { authenticateAdmin } from "./auth.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }
  if (!authenticateAdmin(req, res)) return;
  const { page = 1, limit = 20, search = "" } = req.query;
  let filtered = pacientes;
  if (search) {
    filtered = pacientes.filter(
      (p) =>
        p.nome?.toLowerCase().includes(search.toLowerCase()) ||
        p.email?.toLowerCase().includes(search.toLowerCase()) ||
        p.cidade?.toLowerCase().includes(search.toLowerCase())
    );
  }
  const start = (page - 1) * limit;
  const end = start + Number(limit);
  const data = filtered.slice(start, end);
  return res.json({
    data,
    total: filtered.length,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(filtered.length / limit),
  });
}
