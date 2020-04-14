/**
 * Created by zyj on 2019-12-17
 * 用户信息模块 user
 */
import request from '@/axios/api';
import baseURL from '../../../public/config/configUrl';

const { userUrl } = baseURL;
export function getGuideInfo(data) {
  return request({
    baseURL: userUrl,
    url: 'external/getGuideInfo',
    method: 'post',
    data,
  });
}

export function guideChanges(data) {
  return request({
    baseURL: userUrl,
    url: 'external/guideChanges',
    method: 'post',
    data,
  });
}
