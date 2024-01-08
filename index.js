import inquirer from 'inquirer';
import bomShare from './src/core/boost/bomShare.js';
import { readFile } from 'fs/promises';
import terminalClear from './src/utils/terminalClear.js';
import getCookie from './src/core/getCookie.js';

(async () => {
  terminalClear();
  const json = await readFile('./package.json');
  const jsonData = JSON.parse(json);
  const appName = jsonData.name;
  console.log(`
  ${appName}
  made with ❤️ by janexmgd
  https://github.com/imjanexmgd/shoopee-tool-js
  \n
  `);
  const choices = ['get cookie', 'add favorite', 'bom share', 'bom like'];

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'insert your choice',
      choices: choices,
    },
  ]);
  const { choice } = answers;
  if (choice === 'bom share') {
    await bomShare();
  } else if (choice === 'get cookie') {
    await getCookie();
  } else {
    console.log('hello');
  }
})();
