/**
 *  商品分析模块
 * @Create By Huan 2019-12-17
*/
import request from '@/axios/api';
import baseURL from '../../../public/config/configUrl';

const { apiUrl } = baseURL;
// 畅销款排名
export function bestSellerRank(data) {
  return request({
    baseURL: apiUrl,
    url: 'product/fastMovingGoods',
    method: 'post',
    data,
  });
}

// 品牌/大类
export function conditionList(params = {}) {
  return request({
    baseURL: apiUrl,
    url: 'product/conditionList',
    method: 'get',
    params,
  });
}
// 库存分析
export function stockAnalyze(data) {
  return request({
    baseURL: apiUrl,
    url: 'product/stockAnalyze',
    method: 'post',
    data,
  });
}
// 库存分析柱状图
export function stockAnalyzePie(data) {
  return request({
    baseURL: apiUrl,
    url: 'product/stockAnalyzeGraph',
    method: 'post',
    data,
  });
}
// 库存详细分析
export function stockDetail(data) {
  return request({
    baseURL: apiUrl,
    url: 'product/stockDetails',
    method: 'post',
    data,
  });
}
