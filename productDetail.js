import axios from 'axios';
import * as cheerio from 'cheerio';

const r = await axios.get('https://shopee.co.id/product/16493167/1939742108');
const $ = cheerio.load(r.data);

let jsonData;
$('script[type="application/ld+json"]').each((index, element) => {
  const script = $(element).text();
  const data = JSON.parse(script);
  if (data['@type'] === 'Product') {
    jsonData = data;
  }
});
console.log(jsonData);
