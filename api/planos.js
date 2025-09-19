// api/planos.js

let planos = [
  {
    id: 1,
    nome: "Plano Start Tirze (1 mês)",
    descricao:
      "O início da jornada, ideal para quem quer experimentar e dar o primeiro passo.",
    precos: [{ duracao: "30 Dias", preco: "R$ 1.476,67" }],
  },
  {
    id: 2,
    nome: "Plano Premium Tirze (2 meses)",
    descricao:
      "Evolução consistente, resultados visíveis e acompanhamento estruturado.",
    precos: [{ duracao: "60 Dias", preco: "R$ 2.915,50" }],
  },
  {
    id: 3,
    nome: "Plano Excellence Tirze (3 meses)",
    descricao:
      "Transformação completa, duradoura e definitiva no estilo de vida.",
    precos: [
      { duracao: "120 Dias", preco: "R$ 5.823,81" },
    ],
  },
  {
    id: 4,
    nome: "Plano Start Sema (1 mês)",
    descricao:
      "O início da jornada, ideal para quem quer experimentar e dar o primeiro passo.",
    precos: [
      { duracao: "30 Dias", preco: "R$ 877,08" },
    ],
  },
  {
    id: 5,
    nome: "Plano Premium Sema (2 meses)",
    descricao:
      "Evolução consistente, resultados visíveis e acompanhamento estruturado.",
    precos: [
      { duracao: "60 Dias", preco: "R$ 1.715,32" },
    ],
  },
  {
    id: 6,
    nome: "Plano Excellence Sema (3 meses)",
    descricao:
      "Transformação completa, duradoura e definitiva no estilo de vida.",
    precos: [
      { duracao: "120 Dias", preco: "R$ 2.466,67" },
    ],
  },
];

export default async function handler(req, res) {
  // CORS dinâmico para localhost e produção
  const allowedOrigins = [
    "http://localhost:3000",
    "https://slimshape-three.vercel.app",
    "https://slimshapeapi.vercel.app",
    "https://www.slimshapedigital.com.br/",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigins[0]);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

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
