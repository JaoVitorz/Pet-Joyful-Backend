import jwt from "jsonwebtoken";

export default function ensureAuth(req, res, next) {
  // Allow admin key to act as admin
  const adminKey = req.headers["x-admin-key"] || req.query.admin_key;
  console.log("Headers recebidos:", req.headers);
  console.log("Admin Key recebida:", adminKey);
  console.log("Admin Key esperada:", process.env.ADMIN_KEY);
  console.log("São iguais?", adminKey === process.env.ADMIN_KEY);

  if (!adminKey) {
    console.log("Nenhuma admin key fornecida");
  }

  if (adminKey && adminKey === process.env.ADMIN_KEY) {
    console.log("Admin key válida - autorizando como admin");
    req.isApiKeyValid = true;
    // when valid admin key is provided, treat requester as admin
    req.userRole = "admin";
    return next();
  } else if (adminKey) {
    console.log("Admin key inválida fornecida");
    return res.status(403).json({
      error: "Admin key inválida",
      message:
        "A chave administrativa fornecida não corresponde à chave esperada",
    });
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
    // set role if present in token (we sign tokens with 'tipo')
    req.userRole = payload.tipo || payload.role || null;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
