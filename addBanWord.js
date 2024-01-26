import shopeeLveClient from './src/session/shopeeLveClient.js';
import fs from 'node:fs';
import path from 'node:path';
import { loggerFailed, loggerSuccess } from './src/utils/logger.js';
import inquirer from 'inquirer';
import terminalClear from './src/utils/terminalClear.js';

const addBanWord = async () => {
  try {
    terminalClear();
    const { whatFile } = await inquirer.prompt({
      name: 'whatFile',
      type: 'input',
      message: 'what you file list name, must save at folder list',
    });
    const filePath = path.join(process.cwd(), 'list', whatFile);
    if (!fs.existsSync(filePath)) {
      loggerFailed('File not found at folder list ');
      return;
    }
    const list = fs.readFileSync(filePath, 'utf-8');
    const arrayWord = list.split('\n');
    for (const [index, item] of arrayWord.entries()) {
      const response = await shopeeLveClient.post(
        'https://live.shopee.co.id/api/v1/streamer_word',
        {
          sensitive_words: [`${item}`],
        }
      );
      if (response.data.err_code == 0) {
        if (response.data.data.sensitive_words[0]) {
          loggerSuccess(
            `success add ${item} to ban word || ${parseInt(index) + 1}/${
              arrayWord.length
            }`
          );
        } else {
          loggerFailed(
            `failed add ${item} to ban word || ${parseInt(index) + 1}/${
              arrayWord.length
            }`
          );
        }
      } else {
        console.log(response.data);
        loggerFailed(
          `failed add ${item} || ${parseInt(index) + 1}/${arrayWord.length}`
        );
      }
    }
  } catch (error) {
    throw error;
  }
};
export default addBanWord;
