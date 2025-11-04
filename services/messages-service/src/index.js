import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./database/connection.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import postsRoutes from "./routes/postsRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsPath = path.join(__dirname, "..", "uploads");

// serve uploaded files
app.use("/uploads", express.static(uploadsPath));

app.get("/health", (req, res) => res.json({ service: "messages", status: "ok" }));

// connect to Mongo
connectDB();

// mount routes
app.use("/api/messages", messagesRoutes);
app.use("/api/posts", postsRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`messages-service listening on ${PORT}`));
