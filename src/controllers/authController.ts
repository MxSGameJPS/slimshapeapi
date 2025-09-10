import { Request, Response } from "express";
import prisma from "../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "E-mail e senha obrigatórios" });
  }
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }
  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }
  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET!,
    { expiresIn: "12h" }
  );
  return res.json({ token });
};
