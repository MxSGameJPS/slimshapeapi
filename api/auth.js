import jwt from "jsonwebtoken";

export function authenticateAdmin(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token não fornecido" });
    return false;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "umasecretforteslimshape"
    );
    req.admin = decoded;
    return true;
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
    return false;
  }
}
