import axios from 'axios';
import fs from 'fs';
import path from 'path';
const filepath = path.join(process.cwd(), 'cookie', 'Spmclient.cookie.txt');
let cookie;
if (fs.existsSync(filepath)) {
  cookie = fs.readFileSync(filepath, 'utf-8');
} else {
  fs.writeFileSync(filepath, '', 'utf-8');
}
const shopeeSpmClient = axios.create({
  headers: {
    'User-Agent':
      'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Affiliate-Program-Type': '1',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    Cookie: cookie,
  },
});
export default shopeeSpmClient;
