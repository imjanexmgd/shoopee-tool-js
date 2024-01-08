import axios from 'axios';
import inquirer from 'inquirer';

const like = async (sessionid) => {
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
    for (let index = 0; index < count; index++) {
      const req = await like(sessionid);
      console.log(`${index} ${JSON.stringify(req)}`);
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

export default bomShare;
