const express = require("express");
const router = express.Router();
const axios = require("axios");

const ASAAS_API_URL = "https://www.asaas.com/api/v3";
const ASAAS_TOKEN =
  "$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmJlMjM0NTU2LTBhYTMtNDQ0Yi1hZDViLTY4NjM0YzYwZTdhZTo6JGFhY2hfZTFmYTY1NTgtYTBlMS00MTEyLTg3MDQtNDJjYTkyZmYzNTEw";

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
