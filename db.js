const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function savePreCadastro(fields, examesUrls, diagUrls) {
  // Exemplo de mapeamento dos campos principais
  const {
    nome,
    dataNascimento,
    genero,
    cpf,
    telefone,
    email,
    endereco,
    cidade,
    estado,
    cep,
    // ...outros campos do formulário
  } = fields;

  // Ajuste os campos conforme o frontend
  const query = `
		INSERT INTO pre_cadastros (
			nome, data_nascimento, genero, cpf, telefone, email, endereco, cidade, estado, cep,
			exames_urls, diag_urls, dados_completos
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
		RETURNING id
	`;
  const values = [
    nome,
    dataNascimento,
    genero,
    cpf,
    telefone,
    email,
    endereco,
    cidade,
    estado,
    cep,
    JSON.stringify(examesUrls),
    JSON.stringify(diagUrls),
    JSON.stringify(fields), // Salva todos os dados brutos para segurança
  ];
  const client = await pool.connect();
  try {
    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
}

module.exports = { savePreCadastro };
