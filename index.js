import inquirer from 'inquirer';
import bomShare from './core/bomShare.js';

(async () => {
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
