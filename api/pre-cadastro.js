// Endpoint para receber o pré-cadastro do frontend
const formidable = require("formidable");
const { uploadToCloudinary } = require("../cloudinary");
const { savePreCadastro } = require("../db");

exports.config = {
  api: {
    bodyParser: false,
  },
};

module.exports = async function handler(req, res) {
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
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: "Erro ao salvar dados" });
    }
  });
};
