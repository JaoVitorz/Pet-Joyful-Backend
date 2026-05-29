//import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import connectDB from "../backend/src/database/connection.js";
import app from "../backend/src/app.js";
import type { Request, Response } from "express";

dotenv.config();

// conexão com o banco ao subir a função serverless
connectDB()
  .then(() => console.log("MongoDB conectado no ambiente Vercel"))
  .catch((err: Error) => console.error("Erro ao conectar:", err.message));

// exporta handler serverless
export const handler = serverless(app);

// fallback (caso rodar localmente como função express)
export default async function (req: Request, res: Response): Promise<void> {
  await handler(req, res);
}