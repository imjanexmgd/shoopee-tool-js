import axios from 'axios';
import qr from 'qrcode-terminal';
import { loggerFailed, loggerInfo, loggerSuccess } from '../utils/logger.js';
import terminalClear from '../utils/terminalClear.js';
import fs from 'fs';
import path from 'path';

// source from https://github.com/Lo9ic/GetCookieShopee/blob/main/index.js

const getCookie = async () => {
  try {
    terminalClear();
    const r = await axios(
      'https://shopee.co.id/api/v2/authentication/gen_qrcode',
      {
        credentials: 'include',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
          Accept: '*/*',
          'Accept-Language': 'en-US,en;q=0.5',
          'X-Shopee-Language': 'id',
          'X-Requested-With': 'XMLHttpRequest',
          'X-API-SOURCE': 'pc',
        },
        referrer: 'https://shopee.co.id',
        method: 'GET',
        mode: 'cors',
      }
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
        loggerInfo('Starting generating qr again');
        setTimeout(resolve, 3500);
        continue;
      }
      if (currentStatus != lastStatus) {
        loggerInfo(`QR status : ${currentStatus}`);
      }
      if (currentStatus == 'CONFIRMED') {
        const qrCodeToken = statusQr.data.qrcode_token;
        const reqLogin = await axios.post(
          'https://shopee.co.id/api/v2/authentication/qrcode_login',
          {
            qrcode_token: qrCodeToken,
            device_sz_fingerprint: '',
            client_identifier: { security_device_fingerprint: '' },
          }
        );
        if (reqLogin.headers['set-cookie']) {
          loggerSuccess('Success get Cookie');
          const cookies = reqLogin.headers['set-cookie'];
          loggerInfo('Parsing cookie and save it to file');
          const parsedCookies = cookies
            .map((cookie) => cookie.split(';')[0])
            .join('; ');
          const folderpath = path.join(process.cwd(), 'src', 'session');
          if (!fs.existsSync(folderpath)) {
            loggerInfo('Creating folder for session');
            fs.mkdirSync(folderpath);
          }
          const filePath = path.join(
            process.cwd(),
            'src',
            'session',
            'cookies.txt'
          );
          fs.writeFile(filePath, parsedCookies, (error) => {
            if (error) {
              loggerSuccess('Success saved cookies to cookies.txt');
            } else {
              loggerFailed('Failed when saved cookies');
            }
          });
          console.log('Task success');
          return;
        }
      }
      if (currentStatus == 'CANCELED') {
        break;
      }
      if (currentStatus == 'EXPIRED') {
        break;
      }
      await new Promise((resolve) => {
        setTimeout(resolve, 3500);
      });
    }
  } catch (error) {
    console.log(error);
  }
};
export default getCookie;
