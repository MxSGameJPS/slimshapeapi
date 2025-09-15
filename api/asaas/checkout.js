const axios = require("axios");

const ASAAS_API_URL = "https://www.asaas.com/api/v3";
const ASAAS_TOKEN = process.env.ASAAS_TOKEN;

const allowedOrigins = [
  "http://localhost:3000",
  "https://slimshape-three.vercel.app",
  "https://slimshapeapi.vercel.app",
];

// Função para buscar ou criar customer na Asaas
async function getOrCreateCustomer(cliente) {
  // cliente: { nome, email, cpfCnpj, telefone }
  const params = new URLSearchParams({ cpfCnpj: cliente.cpfCnpj });
  const headers = { access_token: ASAAS_TOKEN };
  const busca = await axios.get(`${ASAAS_API_URL}/customers?${params}`, {
    headers,
  });
  if (busca.data && busca.data.data && busca.data.data.length > 0) {
    return busca.data.data[0].id;
  }
  // Se não existe, cria
  const novo = await axios.post(
    `${ASAAS_API_URL}/customers`,
    {
      name: cliente.nome,
      email: cliente.email,
      cpfCnpj: cliente.cpfCnpj,
      phone: cliente.telefone,
    },
    { headers: { ...headers, "Content-Type": "application/json" } }
  );
  return novo.data.id;
}

module.exports = async function handler(req, res) {
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

  if (req.method === "POST") {
    try {
      // Espera receber no body: { nome, email, cpfCnpj, telefone, ...dadosDoCheckout }
      const { nome, email, cpfCnpj, telefone, ...checkoutData } = req.body;
      if (!nome || !email || !cpfCnpj || !telefone) {
        return res.status(400).json({ error: "Dados do cliente incompletos" });
      }
      // Busca ou cria o customer na Asaas
      const customerId = await getOrCreateCustomer({
        nome,
        email,
        cpfCnpj,
        telefone,
      });
      // Monta o payload do checkout
      const payload = {
        customer: customerId,
        ...checkoutData,
      };
      const response = await axios.post(`${ASAAS_API_URL}/checkout`, payload, {
        headers: {
          "Content-Type": "application/json",
          access_token: ASAAS_TOKEN,
        },
      });
      res
        .status(201)
        .json({
          url: response.data?.invoiceUrl || response.data?.url,
          ...response.data,
        });
    } catch (error) {
      res
        .status(error.response?.status || 500)
        .json({ error: error.response?.data || error.message });
    }
    return;
  }

  res.status(405).json({ error: "Método não permitido" });
};
