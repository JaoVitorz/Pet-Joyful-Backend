import express from "express";
import dotenv from "dotenv";

import connectDB from "./database/connection.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.json({ service: "auth", status: "ok" }));

// connect to DB
connectDB();

// mount auth routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`auth-service listening on ${PORT}`));
