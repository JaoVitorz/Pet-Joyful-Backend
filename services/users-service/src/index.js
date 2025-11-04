import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/connection.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.json({ service: "users", status: "ok" }));

// connect to Mongo
connectDB();

// mount routes
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`users-service listening on ${PORT}`));
