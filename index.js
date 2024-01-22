import inquirer from 'inquirer';
import bomShare from './src/core/boost/bomShare.js';
import { readFile } from 'fs/promises';
import terminalClear from './src/utils/terminalClear.js';
import getCookie from './src/core/getCookie.js';
import BatchLike from './src/core/favorite/addFavorite.js';
import BatchUnLike from './src/core/favorite/removeAlllike.js';
import { loggerFailed, loggerInfo, loggerSuccess } from './src/utils/logger.js';
import getLivechat from './src/core/liveTools/getLiveChat.js';
import bomLike from './src/core/boost/bomLike.js';
import addFavoritebyList from './src/core/favorite/addFavByList.js';

(async () => {
  try {
    terminalClear();
    const json = await readFile('./package.json');
    const jsonData = JSON.parse(json);
    const appName = jsonData.name;
    console.log(
      `${appName}\nmade with ❤️ by janexmgd\nhttps://github.com/imjanexmgd/shoopee-tool-js\ndont forget to star the repo\n`
    );
    const choices = [
      'get cookie',

      'add favorite',
      'add favorite by list',
      'batch unlike',
      'spam like live',
      'spam share live',
      'monitor live chat',
    ];

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'insert your choice',
        choices: choices,
      },
    ]);
    const { choice } = answers;
    if (choice === 'spam share live') await bomShare();
    else if (choice === 'get cookie') await getCookie();
    else if (choice === 'add favorite') await BatchLike();
    else if (choice === 'add favorite by list') await addFavoritebyList();
    else if (choice === 'batch unlike') await BatchUnLike();
    else if (choice === 'monitor live chat') await getLivechat();
    else if (choice === 'spam like live') await bomLike();
    else loggerInfo('to run bom like see readme.md');
    loggerSuccess(`${appName} task success`);
  } catch (error) {
    loggerFailed(error?.message);
  }
})();
