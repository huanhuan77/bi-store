/**
 * Created by zyj on 2019-11-18
 */
import request from '@/axios/api';
import baseURL from '../../../public/config/configUrl';

const { apiUrl } = baseURL;
// 招募饼图数据
export function salseCustomerPieData(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/salseCustomerPieData',
    method: 'post',
    data,
  });
}

// 招募会员列表
export function salseVipList(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/salseVipList',
    method: 'post',
    data,
  });
}

// 会员生日饼图数据
export function vipPieData(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/vipPieData',
    method: 'post',
    data,
  });
}

// 会员生日列表
export function pieVipList(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/pieVipList',
    method: 'post',
    data,
  });
}

// 经销商会员消费
export function vipSale(data) {
  return request({
    baseURL: apiUrl,
    url: 'agencyVip/vipSale',
    method: 'post',
    data,
  });
}

// 店员业绩
export function empSale(data) {
  return request({
    baseURL: apiUrl,
    url: 'emp/sales',
    method: 'post',
    data,
  });
}

// 会员招募汇总
export function recruitCollect(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/recruitCollect',
    method: 'post',
    data,
  });
}
// 本期招募详情
export function salesVipDetail(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/salseVip',
    method: 'post',
    data,
  });
}

// 店员招募列表
export function empList(data) {
  return request({
    baseURL: apiUrl,
    url: '/vip/salseEmpVipList',
    method: 'post',
    data,
  });
}

// 会员标签维护
export function vipLabelMaintain(data) {
  return request({
    baseURL: apiUrl,
    url: '/analyze/storeVipLabel',
    method: 'post',
    data,
  });
}
// 会员标签维护详情
export function empVipLable(data) {
  return request({
    baseURL: apiUrl,
    url: '/analyze/empVipLable',
    method: 'post',
    data,
  });
}
