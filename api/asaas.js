const express = require("express");
const router = express.Router();
const axios = require("axios");

const ASAAS_API_URL = "https://www.asaas.com/api/v3";
const ASAAS_TOKEN = process.env.ASAAS_TOKEN;

// Middleware CORS para endpoints serverless (garante CORS em todas as rotas)
function corsHandler(req, res) {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://slimshape-three.vercel.app",
    "https://slimshapeapi.vercel.app",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigins[0]);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

// Aplica CORS em cada rota
router.use((req, res, next) => {
  if (!corsHandler(req, res)) next();
});

// Criar cobrança
router.post("/cobranca", async (req, res) => {
  try {
    const response = await axios.post(`${ASAAS_API_URL}/payments`, req.body, {
      headers: {
        "Content-Type": "application/json",
        access_token: ASAAS_TOKEN,
      },
    });
    res.status(201).json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json({ error: error.response?.data || error.message });
  }
});

// Consultar cobrança por ID
router.get("/cobranca/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${ASAAS_API_URL}/payments/${req.params.id}`,
      {
        headers: {
          access_token: ASAAS_TOKEN,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json({ error: error.response?.data || error.message });
  }
});

// Listar cobranças de um cliente
router.get("/cobrancas/:customerId", async (req, res) => {
  try {
    const response = await axios.get(`${ASAAS_API_URL}/payments`, {
      headers: {
        access_token: ASAAS_TOKEN,
      },
      params: {
        customer: req.params.customerId,
      },
    });
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json({ error: error.response?.data || error.message });
  }
});

module.exports = router;
