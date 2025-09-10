import { pacientes } from "./db.js";
import { authenticateAdmin } from "./auth.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }
  if (!authenticateAdmin(req, res)) return;
  // Simula planos ativos por paciente
  const planos = pacientes.map((p) => ({
    pacienteId: p.id,
    nome: p.nome,
    progresso: "em andamento",
    valor: 499.9,
    status: "ativo",
  }));
  return res.json({ data: planos });
}
