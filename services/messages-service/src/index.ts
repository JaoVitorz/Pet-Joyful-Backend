import 'dotenv/config';
import connectDB from './database/connection.js';
import app from './app.js';

void connectDB().then(() => {
  const port = process.env.PORT || 3003;
  app.listen(port, () => console.log(`messages-service listening on ${port}`));
});
