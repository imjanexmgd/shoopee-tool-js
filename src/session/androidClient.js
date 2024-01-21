import axios from 'axios';

const androidClient = axios.create({
  headers: {
    'User-Agent': 'okhttp/3.12.4 app_type=1',
    'Accept-Encoding': 'gzip',
    'Content-Type': 'application/json',
    shopee_http_dns_mode: '1',
    'x-shopee-client-timezone': 'Asia/Jakarta',
    language: 'id',
    manufacturer: 'Xiaomi',
    network: 'mobile',
    os: '33',
    phone: 'Brand/xiaomi Model/redmi_note_8 OSVer/33 Manufacturer/Xiaomi',
  },
});
export default androidClient;
