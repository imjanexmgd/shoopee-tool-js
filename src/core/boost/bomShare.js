import axios from 'axios';
import inquirer from 'inquirer';
import { loggerFailed, loggerSuccess } from '../../utils/logger.js';

// dont forget to insert refer when you recode this lmao
const share = async (sessionid) => {
  try {
    const r = await axios.post(
      `https://live.shopee.co.id/api/v1/session/${sessionid}/msg/share`,
      {
        headers: {
          'User-Agent': 'okhttp/3.12.4 app_type=1',
          'Accept-Encoding': 'gzip',
          'Content-Type': 'application/json',
          shopee_http_dns_mode: '1',
          'x-shopee-client-timezone': 'Asia/Jakarta',
        },
        data: {
          share_to: '',
        },
      }
    );
    return r.data;
  } catch (error) {
    console.log(error);
  }
};

const bomShare = async () => {
  try {
    const answers = await inquirer.prompt([
      {
        name: 'count',
        message: 'insert number of count',
        type: 'input',
      },
      {
        name: 'sessionid',
        message: 'insert target id',
        type: 'input',
      },
    ]);
    const { count, sessionid } = answers;
    console.clear();
    for (let index = 1; index <= count; index++) {
      try {
        await share(sessionid);
        loggerSuccess(`success share ${sessionid} || ${index}/${count}`);
      } catch (error) {
        loggerFailed(`failed to share`);
        break;
      }
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

export default bomShare;
