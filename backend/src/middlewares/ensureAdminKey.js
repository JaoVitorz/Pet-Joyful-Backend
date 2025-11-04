import dotenv from "dotenv";

dotenv.config();

export default function ensureAdminKey(req, res, next) {
  const adminKey = req.headers["x-admin-key"] || req.query.admin_key;
  if (!adminKey) {
    return res.status(401).json({ error: "Admin key ausente" });
  }

  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: "Admin key inválida" });
  }

  // valid admin key
  req.isApiKeyValid = true;
  req.userRole = "admin";
  return next();
}
