import { Request, Response } from "express";
import prisma from "../utils/prisma";
import cloudinary from "../utils/cloudinary";

// Função auxiliar para upload de múltiplos arquivos
async function uploadFilesToCloudinary(
  files: Express.Multer.File[] | undefined
) {
  if (!files || files.length === 0) return [];
  const uploads = await Promise.all(
    files.map((file) =>
      cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error || !result) throw error;
          return result.secure_url;
        }
      )
    )
  );
  return uploads;
}

export const preCadastro = async (req: Request, res: Response) => {
  try {
    // Campos do formulário (exceto arquivos)
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
      diagnosticosAnteriores,
      consentimentoTelemedicina,
      consentimentoLGPD,
      consentimentoTermos,
    } = req.body;

    // Upload dos arquivos (exames e diagnósticos)
    const examesArquivos = req.files && (req.files as any).examesArquivos;
    const diagnosticosArquivos =
      req.files && (req.files as any).diagnosticosArquivos;

    // Upload para Cloudinary
    const examesArquivosUrl = examesArquivos
      ? await Promise.all(
          examesArquivos.map(async (file: Express.Multer.File) => {
            const result = await cloudinary.uploader.upload(file.path, {
              resource_type: "auto",
            });
            return result.secure_url;
          })
        )
      : [];
    const diagnosticosArquivosUrl = diagnosticosArquivos
      ? await Promise.all(
          diagnosticosArquivos.map(async (file: Express.Multer.File) => {
            const result = await cloudinary.uploader.upload(file.path, {
              resource_type: "auto",
            });
            return result.secure_url;
          })
        )
      : [];

    // Salvar no banco
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
        examesArquivosUrl,
        diagnosticosAnteriores,
        diagnosticosArquivosUrl,
        consentimentoTelemedicina:
          consentimentoTelemedicina === "true" ||
          consentimentoTelemedicina === true,
        consentimentoLGPD:
          consentimentoLGPD === "true" || consentimentoLGPD === true,
        consentimentoTermos:
          consentimentoTermos === "true" || consentimentoTermos === true,
      },
    });

    return res.status(201).json({ success: true, paciente });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Erro ao cadastrar paciente" });
  }
};
