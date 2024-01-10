import shoopeClient from '../../session/shoopeClient.js';
import { loggerSuccess } from '../../utils/logger.js';

const BanUser = async (sessionid, uid, isBan) => {
  try {
    const data = {
      is_ban: isBan,
      ban_uid: uid, //71854120 ex
    };
    const url = `https://live.shopee.co.id/webapi/v1/session/${sessionid}/comment/ban`;
    const r = await shoopeClient.post(url, data);
    if (r.data.error == 0) {
      let msg;
      if (isBan == true) {
        msg = 'Success ban user with id' + uid;
      }
      loggerSuccess(`${msg}`);
      return;
    } else {
      throw { message: JSON.stringify(r.data) };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export default BanUser;
// BanUser(null, 71854120, true);
