import dotenv from "dotenv";
import connectDB from "./src/database/connection.js";
import app from "./src/app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Conectar ao banco
connectDB().then(() => {
  // Apenas inicia servidor em ambiente de desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Auth Service rodando na porta ${PORT}`);
    });
  } else {
    console.log('✅ Auth Service conectado ao MongoDB (Vercel)');
  }
}).catch(err => {
  console.error('❌ Falha ao conectar ao banco:', err);
});

// Exportar para Vercel (serverless)
export default app;