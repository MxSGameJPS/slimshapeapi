const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware para JSON e urlencoded
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Servir Swagger
app.use("/swagger.css", express.static(path.join(__dirname, "swagger.css")));
app.use("/swagger.html", express.static(path.join(__dirname, "swagger.html")));
app.use("/swagger.json", express.static(path.join(__dirname, "swagger.json")));

// As rotas da API são servidas diretamente pelos arquivos em /api no padrão Vercel serverless

// Página inicial
app.get("/", (req, res) => {
  res.send(
    '<h2>API SlimShape rodando! <a href="/swagger.html">Documentação Swagger</a></h2>'
  );
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
