import { pacientes } from "./db.js";
import { authenticateAdmin } from "./auth.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }
  if (!authenticateAdmin(req, res)) return;
  // Agregações simples para exemplo
  const totalPacientes = pacientes.length;
  const porEstado = Object.entries(
    pacientes.reduce((acc, p) => {
      acc[p.estado] = (acc[p.estado] || 0) + 1;
      return acc;
    }, {})
  ).map(([estado, count]) => ({ estado, count }));
  const porSexo = Object.entries(
    pacientes.reduce((acc, p) => {
      acc[p.genero] = (acc[p.genero] || 0) + 1;
      return acc;
    }, {})
  ).map(([genero, count]) => ({ genero, count }));
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
}
