// api/planos.js

let planos = [
  {
    id: 1,
    nome: "Plano Total",
    descricao:
      "Avaliação Médica. Entrega de Medicamentos na sua porta. Suporte clínico via WhatsApp. Acompanhamento nutricional.",
  },
  {
    id: 2,
    nome: "Plano Básico",
    descricao: "Avaliação Médica e Entrega de Medicamento",
  },
];

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "GET") {
    return res.status(200).json(planos);
  }

  if (req.method === "POST") {
    const { nome, descricao } = req.body;
    if (!nome || !descricao) {
      return res
        .status(400)
        .json({ error: "Nome e descrição são obrigatórios." });
    }
    const novoPlano = {
      id: planos.length + 1,
      nome,
      descricao,
    };
    planos.push(novoPlano);
    return res.status(201).json(novoPlano);
  }

  res.status(405).json({ error: "Método não permitido" });
}
