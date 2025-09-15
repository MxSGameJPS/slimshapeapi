// Endpoint para receber notificações de webhook da Asaas
module.exports = async function handler(req, res) {
  // Permitir CORS para produção e localhost
  const allowedOrigins = [
    "http://localhost:3000",
    "https://slimshape-three.vercel.app",
    "https://slimshapeapi.vercel.app",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  // Aqui você pode tratar os eventos recebidos da Asaas
  // Exemplo: salvar no banco, atualizar status, etc.
  console.log("Webhook recebido da Asaas:", req.body);

  // Sempre responda 200 para confirmar recebimento
  res.status(200).json({ received: true });
};
