import { pacientes } from "./db.js";
import { authenticateAdmin } from "./auth.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }
  if (!authenticateAdmin(req, res)) return;
  // Simula vendas por paciente
  const vendas = pacientes.map((p) => ({
    pacienteId: p.id,
    nome: p.nome,
    quantidade: Math.floor(Math.random() * 10) + 1,
    frequencia: "mensal",
    valor: 299.9,
    status: "pago",
  }));
  return res.json({ data: vendas });
}
