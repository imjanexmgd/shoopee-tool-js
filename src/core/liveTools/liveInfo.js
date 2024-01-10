import axios from 'axios';
import androidClient from '../../session/androidClient.js';

const liveInfo = async (sessionid) => {
  try {
    const url = `https://live.shopee.co.id/api/v1/session/${sessionid}/joinv2`;
    const response = await androidClient.post(url, {
      uuid: '153d8ff43df54cf597918a8ae2d5e542=',
      rtc_not_loaded: true,
      is_boost: false,
      need_follow_session: false,
      recommendation_reason: '[]',
      recommendation_extra:
        '{"scene":"livestream_fullscreen","ques":"STREAM-HOTATC-ST1|STREAM-SLIDE-VIEW-CF|STREAM-DhotWatchTime|STREAM-AFFILICATE-CR|STREAM-BACKUP","rrkpos":"1@fix_slot_op=33>37|rerank_model_50=37>2|qc_deboost=2>2|ecology_boost=2>2|streamer_boost=2>2|newstreamer_boost=2>13|tier_boost=13>13|kol_boost=13>13","from_source":"home_tab"}',
    });
    let data;
    if (response.data.err_msg == 'Berhasil') {
      const {
        session_id,
        username,
        nickname,
        title,
        start_time,
        end_time,
        chatroom_id,
      } = response.data.data.session;
      // console.log(response.data);
      data = {
        success: true,
        session_id,
        username,
        nickname,
        title,
        start_time,
        end_time,
        chatroom_id,
        share_url: response.data.data.share_url,
      };
    } else {
      throw {
        err_code: response.data.err_code,
        success: false,
        message: response.data.err_msg,
      };
    }
    return data;
  } catch (error) {
    throw error;
  }
};
// liveInfo(55609885);
export default liveInfo;
