import inquirer from 'inquirer';
import shopeeLveClient from '../../session/shopeeLveClient.js';
import { loggerFailed, loggerInfo, loggerSuccess } from '../../utils/logger.js';
import terminalClear from '../../utils/terminalClear.js';
import loginInfo from '../loginInfo.js';
import delay from '../../utils/delay.js';

const searchProduct = async (keyword) => {
  try {
    terminalClear();
    const pageLimit = 20; // max 20
    const totalPage = 5; // total item = page*limit
    const datas = [];
    loggerInfo('This progam will get item total 100 if available');
    for (let page = 0; page < totalPage; page++) {
      const params = new URLSearchParams({
        list_type: '0',
        keyword: keyword,
        sort_type: '2',
        page_offset: String(page * pageLimit),
        page_limit: 20,
        client_type: '1',
        filter_types: '2',
      });

      const url = `https://affiliate.shopee.co.id/api/v3/offer/product/list?${params}`;
      const a = await shopeeLveClient.get(url);
      if (a.data.data.list.length == 0) {
        loggerInfo('No product at list,search product will stop');
        break;
      }
      const products = a.data.data.list;
      loggerSuccess(`Success get ${products.length} product`);
      products.map((e, i) => {
        const { itemid, shopid, name } = e.batch_item_for_item_card_full;
        const product = {
          name: name,
          itemid: parseInt(itemid),
          shopid: parseInt(shopid),
        };
        datas.push(product);
      });
      loggerSuccess(`Total current product : ${datas.length}`);
      await delay(100);
    }
    loggerSuccess(`Total data obtained : ${datas.length}`);
    loggerSuccess(`Task will stop`);

    return datas;
  } catch (error) {
    console.log(error);
  }
};
const likeProduct = async ({ name, itemid, shopid }) => {
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
      loggerSuccess(`Success like ${name}`);
    } else {
      loggerFailed(`Already like ${name}`);
    }
    await delay(150);
    return;
  } catch (error) {
    console.log(`error when like product :${error.message}`);
  }
};
const BatchLike = async () => {
  try {
    terminalClear();
    await loginInfo('lve');
    const r = await inquirer.prompt({
      name: 'keyword',
      type: 'input',
      message: 'insert your product keyword to search',
    });
    const products = await searchProduct(r.keyword);
    for (const product of products) {
      await likeProduct(product);
    }
    loggerSuccess('Batchlike success and will stopped');
  } catch (error) {
    loggerFailed(error.message);
    return;
  }
};
// BatchLike();
// // searchProduct('baju pria');
export default BatchLike;
