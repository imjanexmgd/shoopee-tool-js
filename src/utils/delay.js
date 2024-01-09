import { loggerInfo } from './logger.js';
const delay = async (ms) => {
  loggerInfo(`Waiting for delay ${ms}`);
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
export default delay;
