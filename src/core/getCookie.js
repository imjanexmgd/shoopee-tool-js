import axios from 'axios';
import qr from 'qrcode-terminal';
import { loggerFailed, loggerInfo, loggerSuccess } from '../utils/logger.js';
import terminalClear from '../utils/terminalClear.js';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

// source from https://github.com/Lo9ic/GetCookieShopee/blob/main/index.js
axios.defaults.headers.common['User-Agent'] =
  'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0';
const getCookie = async () => {
  try {
    console.log('Lve client for set ur live client');
    console.log('Spm client for set ur spammer client (for bom like)');
    const choices = ['Lve client', 'Spm client'];
    const ask = await inquirer.prompt({
      type: 'list',
      message: 'do you want set cookie for ?',
      name: 'clientType',
      choices: choices,
    });
    const { clientType } = ask;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      terminalClear();
      const r = await axios.get(
        'https://shopee.co.id/api/v2/authentication/gen_qrcode'
      );
      const { qrcode_id } = r?.data?.data;
      qr.generate(
        `https://shopee.co.id/universal-link/qrcode-login?id=${qrcode_id}`,
        { small: true }
      );

      let lastStatus = '';
      while (true) {
        const statusQr = await axios.get(
          `https://shopee.co.id/api/v2/authentication/qrcode_status?qrcode_id=${qrcode_id}`
        );
        const currentStatus = statusQr?.data?.data?.status;

        if (currentStatus == undefined) {
          loggerFailed('Failed when generated qr, please try again');
          loggerInfo(
            `Starting generating qr again (Attempt ${
              attempts + 1
            }/${maxAttempts})`
          );
          await new Promise((resolve) => {
            setTimeout(resolve, 3500);
          });
          attempts++;
          break;
        }

        if (currentStatus != lastStatus) {
          loggerInfo(`QR status : ${currentStatus}`);
        }

        if (currentStatus == 'CONFIRMED') {
          const qrCodeToken = statusQr.data.data.qrcode_token;
          const reqLogin = await axios.post(
            'https://shopee.co.id/api/v2/authentication/qrcode_login',
            {
              qrcode_token: qrCodeToken,
              device_sz_fingerprint: '',
              client_identifier: {
                security_device_fingerprint: '',
              },
            }
          );
          if (reqLogin.headers['set-cookie']) {
            loggerSuccess('Success get Cookie');
            const cookies = reqLogin.headers['set-cookie'];
            loggerInfo('Parsing cookie and save it to file');
            const parsedCookies = cookies
              .map((cookie) => cookie.split(';')[0])
              .join('; ');
            const data = `${parsedCookies}`;
            let filename;
            if (clientType == 'Lve client') {
              filename = 'Lveclient.cookie.txt';
            } else if (clientType == 'Spm client') {
              filename = 'Spmclient.cookie.txt';
            }
            const filePath = path.join(process.cwd(), 'cookie', filename);
            fs.writeFile(filePath, data, (error) => {
              if (error) {
                loggerFailed('Failed when saved cookies');
              } else {
                loggerSuccess('Success saved cookies to ' + filename);
              }
            });
            loggerSuccess('Task success');
            return;
          }
          return;
        }

        if (currentStatus == 'CANCELED' || currentStatus == 'EXPIRED') {
          loggerFailed('Qrcode have canceled or expired');
          break;
        }

        await new Promise((resolve) => {
          setTimeout(resolve, 3500);
        });
      }
    }

    loggerFailed(`Failed to generate QR code after ${maxAttempts} attempts`);
  } catch (error) {
    console.log(error);
  }
};
export default getCookie;
