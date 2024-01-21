import shopeeLveClient from '../session/shopeeLveClient.js';
import shopeeSpmClient from '../session/shopeeSpmClient.js';
import delay from '../utils/delay.js';
import { loggerFailed, loggerSuccess } from '../utils/logger.js';
import terminalClear from '../utils/terminalClear.js';
const loginInfo = async (role) => {
  try {
    terminalClear();
    if (role == 'spm') {
      const url = 'https://shopee.co.id/api/v4/account/get_profile';
      const r = await shopeeSpmClient.get(url);
      if (r.data.data == null) {
        throw new Error('Invalid credentials please use get cookie again');
      }
      loggerSuccess(`Login as Username: ${r.data.data.user_profile.username}`);
      delay(5000);
      console.log();
      return;
    } else if (role == 'lve') {
      const url = 'https://shopee.co.id/api/v4/account/get_profile';
      const r = await shopeeLveClient.get(url);
      if (r.data.data == null) {
        throw new Error('Invalid credentials please use get cookie again');
      }
      loggerSuccess(`Login as Username: ${r.data.data.user_profile.username}`);
      delay(5000);
      console.log();
      return;
    }
  } catch (error) {
    loggerFailed(`Failed login`);
    throw error;
  }
};
export default loginInfo;
