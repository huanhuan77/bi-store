/**
 * Created by zyj on 2019-11-9
 */
import request from '@/axios/api';
import baseURL from '../../../public/config/configUrl';

const { apiUrl } = baseURL;
export function updateStore(data) {
  return request({
    baseURL: apiUrl,
    url: 'base/updateStore',
    method: 'post',
    data,
  });
}
