import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (req, res) =>
  res.json({ service: "reports", status: "ok" })
);

app.post("/api/reports", (req, res) => {
  res
    .status(501)
    .json({ message: "Implement POST /api/reports in reports-service" });
});

app.get("/api/reports", (req, res) => {
  res
    .status(501)
    .json({ message: "Implement GET /api/reports in reports-service" });
});

app.put("/api/reports/:id", (req, res) => {
  res
    .status(501)
    .json({ message: "Implement PUT /api/reports/:id in reports-service" });
});

app.delete("/api/reports/:id", (req, res) => {
  res
    .status(501)
    .json({ message: "Implement DELETE /api/reports/:id in reports-service" });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`reports-service listening on ${PORT}`));
