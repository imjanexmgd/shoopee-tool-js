import axios from 'axios';
import inquirer from 'inquirer';
import fs from 'node:fs';
import delay from '../../utils/delay.js';
import path from 'node:path';
import { loggerFailed, loggerInfo, loggerSuccess } from '../../utils/logger.js';
import terminalClear from '../../utils/terminalClear.js';
import shopeeLveClient from '../../session/shopeeLveClient.js';
import loginInfo from '../loginInfo.js';

const likeProduct = async ({ itemid, shopid }) => {
  try {
    const url = 'https://shopee.co.id/api/v4/pages/like_items'; // unlike_items
    const data = {
      shop_item_ids: [
        {
          shop_id: shopid,
          item_id: itemid,
        },
      ],
    };
    const req = await shopeeLveClient.post(url, data);
    if (req.data.error == 0) {
      loggerSuccess(`Success like product with id ${itemid}`);
    } else {
      loggerFailed(`Failed when give like`);
    }

    return;
  } catch (error) {
    console.log(`error when like product :${error.message}`);
  }
};
const extractShortUrl = async (shortUrl) => {
  try {
    const r = await axios.get(shortUrl);
    const fullUrl = r.request.res.responseUrl;
    const parsedUrl = fullUrl.split('?')[0];
    loggerSuccess(`Success get full url : ${parsedUrl}`);
    return parsedUrl;
  } catch (error) {
    throw error;
  }
};
const processShortenShoopeLink = async (shortenUrl, current, length) => {
  try {
    console.log('process shorten shopee link');
    const fullUrl = await extractShortUrl(shortenUrl);
    const itemId = fullUrl.split('/').slice(-1)[0];
    const shopId = fullUrl.split('/').slice(-2, -1)[0];
    const product = {
      itemid: parseInt(itemId),
      shopid: parseInt(shopId),
    };
    await likeProduct(product);
    loggerInfo(`Progress ${parseInt(current) + 1} || ${parseInt(length)}`);
    await delay(150);
  } catch (error) {
    throw error;
  }
};
const processShopeeLinkFrompc = async (url, current, length) => {
  try {
    loggerInfo('process shopee link from pc');
    const parsingUrl = url.split('?')[0].split('/')[3].split('.');
    const itemId = parsingUrl.slice(-1)[0];
    const shopId = parsingUrl.slice(-2, -1)[0];
    // const fixedUrl = `https://shopee.co.id/product/${shopId}/${itemId}`;
    const product = {
      itemid: parseInt(itemId),
      shopid: parseInt(shopId),
    };
    await likeProduct(product);
    loggerInfo(`Progress ${parseInt(current) + 1} || ${parseInt(length)}`);
    await delay(150);
  } catch (error) {
    throw error;
  }
};
const addFavoritebyList = async () => {
  try {
    terminalClear();
    await loginInfo('lve');
    loggerInfo(`its feature use Live client !!!`);
    loggerInfo(
      'list must save at folder list at cwd, recommended use txt file'
    );
    console.log();
    const shortLinkRegex = /https:\/\/shope\.ee\/[a-zA-Z0-9]+/;
    const shopeeLinkPcRegex =
      /https:\/\/shopee\.co\.id\/.+-\d+\.+\d+\?.+&xptdk=.{32}&fbclid=.{32}/;
    const { filename } = await inquirer.prompt({
      name: 'filename',
      type: 'input',
      message: 'insert your filename',
    });
    terminalClear();
    let listLink;
    const filePath = path.join(process.cwd(), 'list', filename);
    if (fs.existsSync(filePath)) {
      const dataBuffer = fs.readFileSync(filePath, 'utf-8');
      listLink = dataBuffer.split('\n');
    } else {
      loggerFailed(`${filename} not found`);
    }
    for (const key in listLink) {
      const isShortLink = listLink[key].match(shortLinkRegex);
      if (isShortLink) {
        loggerInfo('Shorten Url : ' + listLink[key]);
        await processShortenShoopeLink(listLink[key], key, listLink.length);
      } else if (shopeeLinkPcRegex) {
        loggerInfo('Link from pc detected');
        // console.log('bong');
        await processShopeeLinkFrompc(listLink[key], key, listLink.length);
      } else {
        loggerFailed(
          'Failed give link because link not supported ' + listLink[key]
        );
      }
    }
    return;
  } catch (error) {
    console.log(error);
  }
};
// addFavoritebyList();
export default addFavoritebyList;
