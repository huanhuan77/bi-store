/**
 * Created by zyj on 2019-07-05.
 * API接口类
 * 销售业绩模块
 */

import request from '@/axios/api';

import baseURL from '../../../public/config/configUrl';

const { apiUrl } = baseURL;
/**
 * 首页信息
 */
export function home(data = {}) {
  return request({
    baseURL: apiUrl,
    url: 'sales/home',
    method: 'post',
    data,
  });
}
/**
 * 首页信息（个人）
 */
export function myHome(data = {}) {
  return request({
    baseURL: apiUrl,
    url: 'sales/myHome',
    method: 'post',
    data,
  });
}
/**
 * 业绩详情
 */
export function storePerformance(params = {}) {
  return request({
    baseURL: apiUrl,
    url: 'sales/salesPage',
    method: 'get',
    params,
  });
}

/**
 * 业绩排名
 * @param params
 */
export function storeRange(params = {}) {
  return request({
    baseURL: apiUrl,
    url: 'sales/salesStoreRank',
    method: 'get',
    params,
  });
}
/**
 * 业绩表格数据
 */
export function ListData(data = {}) {
  return request({
    baseURL: apiUrl,
    url: 'sales/tableData',
    method: 'post',
    data,
  });
}

/**
 * 储值卡表格
 */
export function ValueCard(params = {}) {
  return request({
    baseURL: apiUrl,
    url: 'sales/valueCardPage',
    method: 'get',
    params,
  });
}

/**
 * 个人业绩
 */
export function PersonalPerformance(data = {}) {
  return request({
    baseURL: apiUrl,
    url: 'sales/myPerformance',
    method: 'post',
    data,
  });
}
/**
 * 个人会员招募
 * Create By zyj 2019-7-13
 */
export function PersonalMember(data = {}) {
  return request({
    baseURL: apiUrl,
    url: 'sales/myVipRecruit',
    method: 'post',
    data,
  });
}

/**
 *  1730会员提醒(首页)
 * @Create By zyj 2019-7-25
 */
export function storeRemind(data = {}) {
  return request({
    baseURL: apiUrl,
    url: 'sales/storeRemind',
    method: 'post',
    data,
  });
}

/**
 *  1730会员提醒
 * @Create By zyj 2019-7-18
 */
export function salesStoreRemind(data = {}) {
  return request({
    baseURL: apiUrl,
    url: 'sales/salesStoreRemind',
    method: 'post',
    data,
  });
}

/**
 * Created by zyj on 2019-12-4
 * 1730店员回访
 */
export function remindReturnRecord(data) {
  return request({
    baseURL: apiUrl,
    url: 'sales/remindReturnRecord',
    method: 'post',
    data,
  });
}

/**
 * Created by zyj on 2019-12-4
 * 新增或修改回访信息
 */
export function setRemindReturn(data) {
  return request({
    baseURL: apiUrl,
    url: 'sales/setRemindReturn',
    method: 'post',
    data,
  });
}

/**
 * Created by zyj on 2019-12-7
 * 会员回访详情
 */
export function remindReturnDetail(data) {
  return request({
    baseURL: apiUrl,
    url: 'sales/remindReturnDetail',
    method: 'post',
    data,
  });
}
