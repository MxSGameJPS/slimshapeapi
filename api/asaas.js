const express = require("express");
const router = express.Router();
const axios = require("axios");

const ASAAS_API_URL = "https://www.asaas.com/api/v3";
const ASAAS_TOKEN = process.env.ASAAS_TOKEN;

// Função utilitária para CORS (pode ser usada em cada rota)
function setCorsHeaders(res, origin) {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://slimshape-three.vercel.app",
    "https://slimshapeapi.vercel.app",
    "https://www.slimshapedigital.com.br",
  ];
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

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

// Handler universal para OPTIONS
router.options("*", (req, res) => {
  setCorsHeaders(res, req.headers.origin);
  res.status(204).end();
});

// Criar cobrança
router.post("/cobranca", async (req, res) => {
  setCorsHeaders(res, req.headers.origin);
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
  setCorsHeaders(res, req.headers.origin);
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
  setCorsHeaders(res, req.headers.origin);
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
