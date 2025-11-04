import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function ensureAuth(req, res, next) {
  const auth = req.headers["authorization"];
  if (!auth) return res.status(401).json({ error: "Token ausente" });
  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).json({ error: "Formato do token inválido" });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId || payload.id || null;
    req.userEmail = payload.email || null;
    req.userRole = payload.tipo || payload.role || null;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
