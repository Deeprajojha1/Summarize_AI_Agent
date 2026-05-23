import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';

dotenv.config();

const port = Number(process.env.PORT || 5000);

connectDB()
  .then(() => {
    app.listen(port, () => logger.info(`NexFlow AI API running on port ${port}`));
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
