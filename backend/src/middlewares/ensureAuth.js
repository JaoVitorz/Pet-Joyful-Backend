import jwt from "jsonwebtoken";

export default function ensureAuth(req, res, next) {
  // Allow API key to act as admin
  const apiKey = req.headers["x-api-key"] || req.query.api_key;
  if (apiKey && apiKey === process.env.API_KEY) {
    req.isApiKeyValid = true;
    return next();
  }

  const auth = req.headers["authorization"];
  if (!auth) return res.status(401).json({ error: "Token ausente" });
  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).json({ error: "Formato do token inválido" });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Token generated in authController contains { userId, email }
    req.userId = payload.userId || payload.id || null;
    req.userEmail = payload.email || null;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
