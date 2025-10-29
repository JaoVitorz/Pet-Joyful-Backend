import dotenv from "dotenv";
import connectDB from "./src/database/connection.js";
import app from "./src/app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Auth Service rodando na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Falha ao conectar ao banco:', err);
});
