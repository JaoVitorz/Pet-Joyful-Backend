// api/index.js
import express from "express";
import serverless from "serverless-http";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import connectDB from "../backend/src/database/connection.js";
import app from "../backend/src/app.js";
import 'dotenv/config';
import type {Request, Response} from 'express';


dotenv.config();



const router = express.Router();

connectDB()
  .then(() => console.log('✅ MongoDB conectado no ambiente Vercel'))
  .catch(err => console.error('❌ Erro ao conectar:', (err as Error).message));

export const handler = serverless(app);

export default async function (req: Request, res: Response): Promise<void> {
  await handler(req, res);
}