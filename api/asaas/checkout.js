const axios = require("axios");

const ASAAS_API_URL = "https://www.asaas.com/api/v3";
const ASAAS_TOKEN = process.env.ASAAS_TOKEN;

const allowedOrigins = [
  "http://localhost:3000",
  "https://slimshape-three.vercel.app",
  "https://slimshapeapi.vercel.app",
];

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
    // Espera receber no body: customer, billingType, value, dueDate, etc.
    try {
      const response = await axios.post(`${ASAAS_API_URL}/checkout`, req.body, {
        headers: {
          "Content-Type": "application/json",
          access_token: ASAAS_TOKEN,
        },
      });
      // Retorna a URL do checkout para o frontend
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
