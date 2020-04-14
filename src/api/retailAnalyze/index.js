/**
 * 零售分析模块
 * @Create By Huan 2019-12-10
*/
import request from '@/axios/api';
import baseURL from '../../../public/config/configUrl';

const { apiUrl } = baseURL;
// 总业绩分析
export function salesAnalyze(data) {
  return request({
    baseURL: apiUrl,
    url: 'sales/salesAnalyze',
    method: 'post',
    data,
  });
}

// 总业绩分析 --销售金额
export function salesAnalyzeAmount(data) {
  return request({
    baseURL: apiUrl,
    url: 'sales/salesAnalyzeAmountDetail',
    method: 'post',
    data,
  });
}
//总业绩分析详情
export function salesAnalyzeAmountDetail(params) {
  return request({
    baseURL: apiUrl,
    url: 'sales/storeDaySales',
    method: 'get',
    params,
  });
}
// 店员分析
export function storeEmpAnalyze(data) {
  return request({
    baseURL: apiUrl,
    url: 'analyze/storeEmpAnalyze',
    method: 'post',
    data,
  });
}
// 店员详细分析
export function empDataAnalyze(data) {
  return request({
    baseURL: apiUrl,
    url: 'analyze/empDataAnalyze',
    method: 'post',
    data,
  });
}
