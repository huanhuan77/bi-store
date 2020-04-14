/**
 * Created by zyj on 2019-10-21
 * 优惠券接口
 */
import request from '@/axios/api';
import baseURL from '../../../public/config/configUrl';

const { apiUrl } = baseURL;
export function couponStoreList(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/couponStoreList',
    method: 'post',
    data,
  });
}

// export function couponList(params) {
//   return request({
//     url: 'vip/couponList',
//     method: 'get',
//     params,
//   });
// }

export function sendCoupon(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/sendCoupon',
    method: 'post',
    data,
  });
}

export function couponRecordsDetail(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/couponRecordsDetail',
    method: 'post',
    data,
  });
}

export function couponDetial(params) {
  return request({
    baseURL: apiUrl,
    url: 'vip/couponDetial',
    method: 'get',
    params,
  });
}

export function recordsDetial(params) {
  return request({
    baseURL: apiUrl,
    url: 'vip/recordsDetial',
    method: 'get',
    params,
  });
}
