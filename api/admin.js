module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  const { usuario, senha } = req.body;

  // Exemplo fixo - substitua pela consulta ao banco de dados conforme sua necessidade
  if (usuario === "admin@slimshape.com" && senha === "123456") {
    res.status(200).json({
      token: "token_exemplo",
      admin: { id: 1, usuario: "admin@slimshape.com", nome: "Administrador" },
    });
  } else {
    res.status(401).json({ error: "Credenciais inválidas" });
  }
};
