import { admins } from "../db.js";
import jwt from "jsonwebtoken";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }
  const { email, password } = req.body;
  const admin = admins.find(
    (a) => a.email === email && a.password === password
  );
  if (!admin) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }
  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET || "umasecretforteslimshape",
    { expiresIn: "12h" }
  );
  return res.json({ token });
}
