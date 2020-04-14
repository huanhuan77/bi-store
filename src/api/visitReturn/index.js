/**
 * Created by zyj on 2019-12-4
 */
import request from '@/axios/api';
import baseURL from '../../../public/config/configUrl';

const { apiUrl } = baseURL;
// 经销商回访店员列表
export function dealerEmpReturn(data) {
  return request({
    baseURL: apiUrl,
    url: 'base/dealerEmpReturn',
    method: 'post',
    data,
  });
}
