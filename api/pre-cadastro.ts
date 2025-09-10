import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../src/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
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
      plano,
      combinacao,
      historicoMedicoPessoal,
      historicoMedicoFamiliar,
      medicamentos,
      suplementos,
      alergias,
      fuma,
      bebe,
      motivoConsulta,
      sintomas,
      tempoSintomas,
      peso,
      altura,
      historicoPeso,
      habitosAlimentares,
      atividadeFisica,
      freqAtividadeFisica,
      examesRecentes,
      examesArquivosUrl,
      diagnosticosAnteriores,
      diagnosticosArquivosUrl,
      consentimentoTelemedicina,
      consentimentoLGPD,
      consentimentoTermos,
    } = req.body;

    // Validação básica
    if (!nome || !email || !cpf || !telefone || !dataNascimento) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const paciente = await prisma.paciente.create({
      data: {
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
        plano,
        combinacao,
        historicoMedicoPessoal,
        historicoMedicoFamiliar,
        medicamentos,
        suplementos,
        alergias,
        fuma,
        bebe,
        motivoConsulta,
        sintomas,
        tempoSintomas,
        peso: peso ? parseFloat(peso) : null,
        altura: altura ? parseFloat(altura) : null,
        historicoPeso,
        habitosAlimentares,
        atividadeFisica,
        freqAtividadeFisica,
        examesRecentes,
        examesArquivosUrl: Array.isArray(examesArquivosUrl)
          ? examesArquivosUrl
          : examesArquivosUrl
          ? [examesArquivosUrl]
          : [],
        diagnosticosAnteriores,
        diagnosticosArquivosUrl: Array.isArray(diagnosticosArquivosUrl)
          ? diagnosticosArquivosUrl
          : diagnosticosArquivosUrl
          ? [diagnosticosArquivosUrl]
          : [],
        consentimentoTelemedicina:
          consentimentoTelemedicina === true ||
          consentimentoTelemedicina === "true",
        consentimentoLGPD:
          consentimentoLGPD === true || consentimentoLGPD === "true",
        consentimentoTermos:
          consentimentoTermos === true || consentimentoTermos === "true",
      },
    });

    return res.status(201).json({ success: true, paciente });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao cadastrar paciente" });
  }
}
