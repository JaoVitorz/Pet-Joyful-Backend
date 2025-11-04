import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/connection.js";
import messagesRoutes from "./routes/messagesRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (req, res) =>
  res.json({ service: "messages", status: "ok" })
);

// connect to Mongo
connectDB();

// mount routes
app.use("/api/messages", messagesRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`messages-service listening on ${PORT}`));
