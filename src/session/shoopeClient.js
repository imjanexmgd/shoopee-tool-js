import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const shoopeClient = axios.create({
  headers: {
    'User-Agent':
      'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Affiliate-Program-Type': '1',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    Cookie: process.env.SHOPEE_COOKIES,
  },
});
export default shoopeClient;
