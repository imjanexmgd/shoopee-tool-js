import inquirer from 'inquirer';
import shopeeLveClient from '../../session/shopeeLveClient.js';
import loginInfo from '../loginInfo.js';
import { loggerFailed, loggerInfo, loggerSuccess } from '../../utils/logger.js';
import terminalClear from '../../utils/terminalClear.js';
import delay from '../../utils/delay.js';
const unlikeProduct = async (item) => {
  try {
    const { name, itemid, shopid } = item;
    const url = 'https://shopee.co.id/api/v4/pages/unlike_items'; // unlike_items
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
      loggerSuccess(`Success unlike ${name}`);
    } else {
      loggerFailed(`Already unlike ${name}`);
    }
    await delay(150);
    return;
  } catch (error) {
    console.log(`error when like product :${error.message}`);
  }
};
const getMyLikes = async () => {
  try {
    terminalClear();
    let offset = 0;
    let hasMore = true;
    const productLiked = [];
    while (true) {
      const params = new URLSearchParams({
        offset: String(offset),
        limit: '50',
        kw: '',
      });
      const url = `https://live.shopee.co.id/api/v1/item/liked?${params}`;
      loggerInfo(`Fetching data at ${offset} offset`);
      const r = await shopeeLveClient.get(url);
      if (r.data.err_code != 0) {
        loggerFailed('Failed when fetch liked product');
        break;
      }
      const products = r.data?.data?.items;

      products.forEach((item) => {
        const { item_id, shop_id, name, comm_rate } = item;
        const product = {
          name: name,
          itemid: parseInt(item_id),
          shopid: parseInt(shop_id),
          comm_rate: parseInt(comm_rate / 1000),
        };
        productLiked.push(product);
      });
      hasMore = r.data?.data?.has_more;
      if (!hasMore) {
        loggerInfo(`Total data : ${productLiked.length}`);
        loggerInfo(`Pogram wil stopped`);
        break;
      }
      offset = r.data?.data?.next_offset;
      await delay(150);
    }

    loggerSuccess('success get all product liked');
    loggerSuccess(`total Product liked: ${productLiked.length}`);
    return productLiked;
  } catch (error) {
    console.log(error);
  }
};
const BatchUnLike = async () => {
  try {
    terminalClear();

    await loginInfo('lve');
    const { isFilterComm } = await inquirer.prompt({
      name: 'isFilterComm',
      type: 'confirm',
      message: 'do you want filter by commition rate ?',
    });
    if (isFilterComm == true) {
      const myLikes = await getMyLikes();
      const { commRate } = await inquirer.prompt({
        name: 'commRate',
        type: 'input',
        message: 'how many minimum comm rate you want (example 5% input = 5)?',
        validate: function (value) {
          const isValid =
            !isNaN(parseFloat(value)) &&
            isFinite(value) &&
            parseFloat(value) !== 0;
          return isValid ? true : 'input must be number and minimum is zero';
        },
      });
      for (const item of myLikes) {
        if (commRate > item.comm_rate) {
          await unlikeProduct(item);
        } else {
          loggerInfo(
            `skipped unlike ${item.name} because has comm rate ${item.comm_rate}%`
          );
        }
      }
    } else {
      const myLikes = await getMyLikes();
      for (const item of myLikes) {
        await unlikeProduct(item);
      }
    }
    loggerSuccess(`Batch unlike is success and stopped now`);
  } catch (error) {
    loggerFailed(error.message);
    return;
  }
};
// BatchUnLike();
export default BatchUnLike;
