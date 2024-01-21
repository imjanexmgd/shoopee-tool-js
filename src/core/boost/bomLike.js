import shopeeSpmClient from '../../session/shopeeSpmClient.js';
import inquirer from 'inquirer';
import { loggerFailed, loggerSuccess } from '../../utils/logger.js';

const like = async (sessionid, like_cnt) => {
  try {
    const count = like_cnt;
    const r = await shopeeSpmClient.post(
      `https://live.shopee.co.id/api/v1/session/${sessionid}/like`,
      {
        like_cnt: count,
      }
    );
    return r.data;
  } catch (error) {
    throw error;
  }
};

const bomLike = async () => {
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
        await like(sessionid, 50);
        loggerSuccess(
          `Success send 50 like to ${sessionid} || ${index}/${count}`
        );
      } catch (error) {
        console.log(error);
        loggerFailed('Failed send like');
        break;
      }
    }
    return;
  } catch (error) {
    console.log(error);
  }
};
export default bomLike;
