import chalk from 'chalk';
import { readFileSync } from 'fs';
import path from 'path';
import inquirer from 'inquirer';

import liveInfo from './liveInfo.js';
import BanUser from './banningUser.js';
import delay from '../../utils/delay.js';
import terminalClear from '../../utils/terminalClear.js';
import { loggerFailed, loggerSuccess } from '../../utils/logger.js';
import androidClient from '../../session/androidClient.js';

const keyword = () => {
  try {
    const filePath = path.join(process.cwd(), 'keywordList.txt');
    const data = readFileSync(filePath, 'utf-8');
    const keywords = data
      .split('\n')
      .map((keyword) => keyword.trim().toLowerCase());
    return keywords;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const filterMessages = (message, keywords) => {
  // check the word
  if (keywords.some((keyword) => message.includes(keyword))) {
    return { isWarnMessage: false };
  } else {
    return { isWarnMessage: true };
  }
};
const loggerChat = (timestamp, msg) => {
  try {
    const { user, content, userid } = msg;
    const date = new Date(timestamp);
    const timeString = chalk.blue(
      date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Jakarta',
      })
    );
    const formattedMsg = `${chalk.bold(user)} : ${chalk.italic(content)}`;
    console.log(`[${timeString}] : ${formattedMsg}`);
  } catch (error) {
    console.log(error + 'failed logger');
  }
};
const getLivechat = async () => {
  try {
    terminalClear();
    const keywordList = keyword();
    // return console.log(keywordList);
    // ex 55656729;
    const { sessionid } = await inquirer.prompt({
      name: 'sessionid',
      type: 'input',
      message: 'Insert your live session',
    });
    const LiveSession = await liveInfo(sessionid);
    let timestamp = Math.floor(Date.now() / 1000 - 2 * 3600);
    if (LiveSession.success === true) {
      while (true) {
        const SPIM_ID = LiveSession.chatroom_id;
        const searchParams = new URLSearchParams({
          uuid: '153d8ff43df54cf597918a8ae2d5e542=',
          timestamp: timestamp,
          version: 'v2',
        });
        const url = `https://chatroom-live.shopee.co.id/api/v1/fetch/chatroom/${SPIM_ID}/message?${searchParams}`;
        const r = await androidClient.get(url);
        const liveChat = r.data;
        loggerSuccess(`Found ${liveChat.data.message.length} messages`);
        let largestTimestamp = 0;
        for (const messageBlock of liveChat.data.message) {
          if (messageBlock.timestamp > largestTimestamp) {
            largestTimestamp = messageBlock.timestamp;
          }
          for (const message of messageBlock.msgs) {
            const contentJson = JSON.parse(message.content);
            const userid = message.uid;
            const user = message.display_name;
            const content = contentJson.content;
            const msg = { user, content, userid };
            loggerChat(messageBlock.timestamp, msg);
            const doFilter = filterMessages(content, keywordList);

            // contain keyword
            if (doFilter.isWarnMessage == true) {
              // do ban user
              loggerFailed('its contained warn message');
              await BanUser(sessionid, userid, true);
            } else {
              loggerSuccess('not contained warn message');
              console.log();
            }
          }
        }
        timestamp = largestTimestamp;

        if (LiveSession.end_time !== 0) {
          loggerFailed('Live session has ended');
          break;
        }
        await delay(3000);
        console.log();
      }
    }
  } catch (error) {
    console.error('Error:', error);
    return;
  }
};

export default getLivechat;
