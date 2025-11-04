import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();

app.get("/health", (req, res) => res.json({ service: "gateway", status: "ok" }));

// Proxy rules
app.use(
  "/api/auth",
  createProxyMiddleware({ target: "http://localhost:3001", changeOrigin: true })
);
app.use(
  "/api/users",
  createProxyMiddleware({ target: "http://localhost:3002", changeOrigin: true })
);
app.use(
  "/api/messages",
  createProxyMiddleware({ target: "http://localhost:3003", changeOrigin: true })
);
app.use(
  "/api/posts",
  createProxyMiddleware({ target: "http://localhost:3003", changeOrigin: true })
);
app.use(
  "/api/reports",
  createProxyMiddleware({ target: "http://localhost:3004", changeOrigin: true })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`gateway-service listening on ${PORT}`));
