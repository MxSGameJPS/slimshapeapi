// Endpoint compatível com Vercel serverless para receber o pré-cadastro do frontend
const formidable = require("formidable");
const { uploadToCloudinary } = require("../cloudinary");
const { savePreCadastro } = require("../db");

module.exports = async function handler(req, res) {
  // CORS dinâmico para localhost e produção
  const allowedOrigins = [
    "http://localhost:3000",
    "https://slimshape-three.vercel.app",
    "https://www.slimshapedigital.com.br/",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigins[0]);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const form = new formidable.IncomingForm();
  form.multiples = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Erro ao processar formulário" });
    }
    try {
      // Upload dos arquivos para Cloudinary
      let examesUrls = [];
      let diagUrls = [];
      if (files.examesArquivos) {
        const exames = Array.isArray(files.examesArquivos)
          ? files.examesArquivos
          : [files.examesArquivos];
        examesUrls = await Promise.all(
          exames.map((f) => uploadToCloudinary(f.filepath))
        );
      }
      if (files.diagnosticosArquivos) {
        const diags = Array.isArray(files.diagnosticosArquivos)
          ? files.diagnosticosArquivos
          : [files.diagnosticosArquivos];
        diagUrls = await Promise.all(
          diags.map((f) => uploadToCloudinary(f.filepath))
        );
      }
      // Salvar no banco
      await savePreCadastro(fields, examesUrls, diagUrls);
      return res.status(200).json({ examesUrls, diagUrls });
    } catch (e) {
      return res.status(500).json({ error: "Erro ao salvar dados" });
    }
  });
};
