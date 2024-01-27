import axios from 'axios';
import terminalClear from './src/utils/terminalClear.js';

(async () => {
  try {
    terminalClear();
    const param = new URLSearchParams({});
    const a =
      'https://sv.shopee.co.id/api/v2/timeline/me?limit=12&page_context=%7B%22last_ptime%22:1702215351196%7D&request_user_id=6606091&need_total_count=0';
    let timestamp = Math.floor(Date.now());
    let config = {
      method: 'GET',
      url: `https://sv.shopee.co.id/api/v2/timeline/me?limit=50&page_context={"last_ptime":${timestamp}}&request_user_id=962537085&need_total_count=0`,
      headers: {
        'User-Agent': 'okhttp/3.12.4 app_type=1 Cronet/102.0.5005.61',
      },
    };
    const r = await axios.request(config);
    console.log(r.data);
    console.log(r.data.data.list.length);
    return;
    const p = await axios.get('https://id.shp.ee/wjik4by?smtt=0.0.9', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
        requestinfo:
          '{"deviceInfo":{"brand":"Xiaomi","appDeviceName":"Brand/xiaomi Model/redmi_note_8 OSVer/30 Manufacturer/Xiaomi","model":"Redmi Note 8","appOSVersion":"30","platform":0},"networkInfo":{"networkType":"wifi"},"locationInfo":{"addresses":[],"gps":{}}}',
      },
    });
    console.log(p.request.res.responseUrl);
  } catch (error) {
    console.log(error);
  }
})();
