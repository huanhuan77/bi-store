/**
 * Created by DONG on 2019-07-03.
 * API接口类
 * 会员模块
 */
import request from '@/axios/api';
import baseURL from '../../../public/config/configUrl';

const { apiUrl } = baseURL;
/**
 * 会员合计
 */
export function vipTotal(params = {}) {
  return request({
    baseURL: apiUrl,
    url: 'vip/index',
    method: 'get',
    params,
  });
}

/**
 * 会员列表
 */
export function vipList(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/vipList',
    method: 'post',
    data,
  });
}

/**
 *  会员详情
 * @Create By Huan 2019-7-5
 */
export function vipDetail(params) {
  return request({
    baseURL: apiUrl,
    url: 'vip/vipDetails',
    method: 'get',
    params,
  });
}

/**
 *  我的会员列表
 * @Create By Huan 2019-7-5
 */

export function userVipList(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/userVipList',
    method: 'post',
    data,
  });
}

// 会员升级  店铺会员
export function vipUpAndDownList(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/vipUpAndDownList',
    method: 'post',
    data,
  });
}

// 会员生日
export function memberBirthDay(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/vipBirthdaysList',
    method: 'post',
    data,
  });
}

export function setVipBirthdaysReturn(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/setVipBirthdaysReturn',
    method: 'post',
    data,
  });
}
/**
 *  会员招募
 * @Create By Huan 2019-7-10
 */
// 招募排行
export function rank(params) {
  return request({
    baseURL: apiUrl,
    url: 'vip/vipRecruitAreaRank',
    method: 'get',
    params,
  });
}

// 招募列表
export function vipRecruitList(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/vipRecruitList',
    method: 'post',
    data,
  });
}

// 会员招募详情
export function vipRecruitDetails(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/vipRecruitDetails',
    method: 'post',
    data,
  });
}

// 会员招募图表
export function vipRecruitChart(params) {
  return request({
    baseURL: apiUrl,
    url: 'vip/vipRecruitChart',
    method: 'get',
    params,
  });
}

// 消费明细详情
export function consumeDetail(params) {
  return request({
    baseURL: apiUrl,
    url: 'vip/vipOrderDetails',
    method: 'get',
    params,
  });
}


// 动态会员标签
export function vipLabel(params) {
  return request({
    baseURL: apiUrl,
    url: 'vip/vipLabel',
    method: 'get',
    params,
  });
}

// 分配会员
export function assignMember(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/updateVipUserCode',
    method: 'post',
    data,
  });
}

// 固定会员标签
export function fixedVipLabel(params) {
  return request({
    baseURL: apiUrl,
    url: 'vip/FixedTagList',
    method: 'get',
    params,
  });
}

// 添加固定会员标签
export function addFixedVipLabel(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/addVipFixedTag',
    method: 'put',
    data,
  });
}

// 编辑固定标签
export function updFixedVipLabel(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/updVipFixedTag',
    method: 'post',
    data,
  });
}

// 编辑自定义会员标签
export function updDefinedVipLabel(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/updVipDefined',
    method: 'post',
    data,
  });
}

// 优惠券明细
export function couponSalesDetails(params) {
  return request({
    baseURL: apiUrl,
    url: 'vip/couponSalesDetails',
    method: 'get',
    params,
  });
}


// 店员会员生日回访记录
export function vipBirthdaysReturnRecord(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/vipBirthdaysReturnRecord',
    method: 'post',
    data,
  });
}
