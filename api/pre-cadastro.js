import { pacientes } from "./db.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }
  try {
    const data = req.body;
    // Validação básica
    if (
      !data.nome ||
      !data.email ||
      !data.cpf ||
      !data.telefone ||
      !data.dataNascimento
    ) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }
    data.id = pacientes.length + 1;
    data.createdAt = new Date().toISOString();
    pacientes.push(data);
    return res.status(201).json({ success: true, paciente: data });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao cadastrar paciente" });
  }
}
