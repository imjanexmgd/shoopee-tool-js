import chalk from 'chalk';
export const loggerSuccess = (msg) => {
  try {
    const date = new Date();
    const timeString = chalk.blue(
      date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );
    const formattedMsg = chalk.green(msg);
    console.log(`[${timeString}] : ${formattedMsg}`);
  } catch (error) {
    console.log(error + 'failed logger success');
  }
};
export const loggerFailed = (msg) => {
  try {
    const date = new Date();
    const timeString = chalk.blue(
      date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );
    const formattedMsg = chalk.red(msg);
    console.log(`[${timeString}] : ${formattedMsg}`);
  } catch (error) {
    console.log(error + 'failed logger');
  }
};
export const loggerInfo = (msg) => {
  try {
    const date = new Date();
    const timeString = chalk.blue(
      date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );
    const formattedMsg = chalk.magenta(msg);
    console.log(`[${timeString}] : ${formattedMsg}`);
  } catch (error) {
    console.log(error + 'failed logger');
  }
};
