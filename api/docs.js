import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }
  const swaggerPath = path.join(process.cwd(), "swagger.json");
  if (!fs.existsSync(swaggerPath)) {
    return res.status(404).json({ error: "swagger.json não encontrado" });
  }
  const swagger = fs.readFileSync(swaggerPath, "utf-8");
  res.setHeader("Content-Type", "application/json");
  res.send(swagger);
}
