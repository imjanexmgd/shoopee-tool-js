import axios from 'axios';
import { loggerFailed, loggerInfo, loggerSuccess } from './src/utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();
const sendNotifTele = async (text) => {
  const maxRetries = 3;
  let retryCount = 0;
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHANNEL_CHAT_ID = process.env.CHANNEL_CHAT_ID;
  while (retryCount < maxRetries) {
    try {
      await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        `chat_id=${CHANNEL_CHAT_ID}&text=${text}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      loggerSuccess('success send log to telegram');
      break;
    } catch (error) {
      loggerFailed(error.message);
      retryCount++;
      loggerInfo(`Retry attempt ${retryCount}`);

      if (retryCount === maxRetries) {
        loggerFailed('Max retries reached. Unable to send notification.');
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

// sendNotifTele();
export default sendNotifTele;
