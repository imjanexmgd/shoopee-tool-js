import inquirer from 'inquirer';
import bomShare from './core/bomShare.js';
import { readFile } from 'fs/promises';
(async () => {
  console.clear();
  const json = await readFile('./package.json');
  const jsonData = JSON.parse(json);
  const appName = jsonData.name;
  console.log(`
  ${appName}
  made with ❤️ by janexmgd
  https://github.com/imjanexmgd/shoopee-tool-js
  \n
  `);
  const choices = ['bom share', 'bom like'];

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'insert your choice',
      choices: choices,
    },
  ]);
  const { choice } = answers;
  if (choice == 'bom share') {
    await bomShare();
  } else {
    console.log('see readme to use bom like');
  }
})();
