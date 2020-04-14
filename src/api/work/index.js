/**
 * @工作台接口
 * @Create By Huan 2019-7-15
 */
import request from '@/axios/api';
import baseURL from '../../../public/config/configUrl';

const { apiUrl } = baseURL;
// 库存区域查询
export function stockStyle(data) {
  return request({
    baseURL: apiUrl,
    url: 'stock/style',
    method: 'post',
    data,
  });
}

// 商品查询
export function goodSearch(data) {
  return request({
    baseURL: apiUrl,
    url: 'product/findProduct',
    method: 'post',
    data,
  });
}

// 店铺查询
export function storeSearch(params) {
  return request({
    baseURL: apiUrl,
    url: 'base/searchStore',
    method: 'get',
    params,
  });
}

// 店员列表
export function storePeople(params = {}) {
  return request({
    baseURL: apiUrl,
    url: 'base/getEmp',
    method: 'get',
    params,
  });
}

/**
 * 招募
 * @Create By Huan 2019-8-12
 */
// 招募任务列表
export function recruitTask(data) {
  return request({
    baseURL: apiUrl,
    url: 'task/recruit/getTask',
    method: 'post',
    data,
  });
}

// 招募任务删除
export function deleteRecruitTask(params) {
  return request({
    baseURL: apiUrl,
    url: '/task/recruit/delTask',
    method: 'get',
    params,
  });
}
//

// 招募任务新增  店长
export function addRecruitTask(data) {
  return request({
    baseURL: apiUrl,
    url: 'task/recruit/addTask',
    method: 'post',
    data,
  });
}
// 经销商/督导 新增
export function addAgencyTask(data) {
  return request({
    baseURL: apiUrl,
    url: 'task/recruit/add',
    method: 'post',
    data,
  });
}
// 招募任务  店铺列表
export function recruitStoreList(params) {
  return request({
    baseURL: apiUrl,
    url: 'task/recruit/storeTask',
    method: 'get',
    params,
  });
}
// 经销商/督导 任务指标修改
export function modifyRecruit(data) {
  return request({
    baseURL: apiUrl,
    url: 'task/recruit/modifyTask',
    method: 'post',
    data,
  });
}
// 招募任务修改
export function updateRecruitTask(data) {
  return request({
    baseURL: apiUrl,
    url: 'task/recruit/updTask',
    method: 'post',
    data,
  });
}

// 招募任务详情
export function taskRecruitDetail(data) {
  return request({
    baseURL: apiUrl,
    url: 'task/recruit/getTaskItem',
    method: 'post',
    data,
  });
}

/**
 * 储值卡
 * @Create By zyj 2019-8-19
 */
// 储值卡任务列表
export function cardTask(data) {
  return request({
    baseURL: apiUrl,
    url: 'task/card/getTask',
    method: 'post',
    data,
  });
}

// 储值卡任务删除
export function deleteCardTask(params) {
  return request({
    baseURL: apiUrl,
    url: 'task/card/delTask',
    method: 'get',
    params,
  });
}

// 储值卡任务新增
export function addCardTask(data) {
  return request({
    baseURL: apiUrl,
    url: 'task/card/addTask',
    method: 'post',
    data,
  });
}

// 储值卡任务修改
export function updateCardTask(data) {
  return request({
    baseURL: apiUrl,
    url: 'task/card/updTask',
    method: 'post',
    data,
  });
}

// 储值卡任务详情
export function taskCardDetail(data) {
  return request({
    baseURL: apiUrl,
    url: 'task/card/getTaskItem',
    method: 'post',
    data,
  });
}

/**
 * 业绩
 * @Create By zyj 2019-8-19
 */
// 业绩任务新增  店长
export function addPerTask(data) {
  return request({
    baseURL: apiUrl,
    url: 'taskSales/create',
    method: 'put',
    data,
  });
}
// 业绩任务新增 type !==3 督导/经销商
export function addStoreTask(data) {
  return request({
    baseURL: apiUrl,
    url: 'taskSales/addTask',
    method: 'post',
    data,
  });
}
// 业绩任务修改指标  type !==3 督导/经销商
export function modifyStoreTask(data) {
  return request({
    baseURL: apiUrl,
    url: 'taskSales/modifyTask ',
    method: 'post',
    data,
  });
}
// 业绩  店铺列表
export function storeList(params) {
  return request({
    baseURL: apiUrl,
    url: 'taskSales/storeTask',
    method: 'get',
    params,
  });
}

// 业绩任务列表
export function perTask(data) {
  return request({
    baseURL: apiUrl,
    url: 'taskSales/list',
    method: 'post',
    data,
  });
}

// 业绩任务修改
export function updatePerTask(data) {
  return request({
    baseURL: apiUrl,
    url: 'taskSales/update',
    method: 'post',
    data,
  });
}

// 业绩任务删除
export function deletePerTask(params) {
  return request({
    baseURL: apiUrl,
    url: 'taskSales/delete',
    method: 'get',
    params,
  });
}

// 业绩任务详情
export function taskPerDetail(data) {
  return request({
    baseURL: apiUrl,
    url: 'taskSales/TaskSalesItem',
    method: 'post',
    data,
  });
}

/**
 * Created by zyj on 2019-8-30
 */
// 我的业绩任务
export function myTaskPer(data) {
  return request({
    baseURL: apiUrl,
    url: 'myTaskSales/salesTaskList',
    method: 'post',
    data,
  });
}

// 我的业绩任务详情
export function perDateList(data) {
  return request({
    baseURL: apiUrl,
    url: 'myTaskSales/getSalesTaskItemList',
    method: 'post',
    data,
  });
}

// 我的业绩添加
export function myAddTaskPer(data) {
  return request({
    baseURL: apiUrl,
    url: 'myTaskSales/addSalesTaskItem',
    method: 'put',
    data,
  });
}

// 我的招募任务
export function myTaskRecruit(data) {
  return request({
    baseURL: apiUrl,
    url: 'myTaskRecruit/recruitTaskList',
    method: 'post',
    data,
  });
}

// 我的招募任务详情
export function recruitDateList(data) {
  return request({
    baseURL: apiUrl,
    url: 'myTaskRecruit/getRecruitTaskItemList',
    method: 'post',
    data,
  });
}

// 我的招募添加
export function myAddTaskRecruit(data) {
  return request({
    baseURL: apiUrl,
    url: 'myTaskRecruit/addRecruitTaskItem',
    method: 'put',
    data,
  });
}

// 我的储值卡任务
export function myTaskValueCard(data) {
  return request({
    baseURL: apiUrl,
    url: 'myTaskCard/CardTaskList',
    method: 'post',
    data,
  });
}

// 我的储值卡任务详情
export function valueCardDateList(data) {
  return request({
    baseURL: apiUrl,
    url: 'myTaskCard/getCardTaskItemList',
    method: 'post',
    data,
  });
}

// 我的储值卡添加
export function myAddTaskValueCard(data) {
  return request({
    baseURL: apiUrl,
    url: 'myTaskCard/addCardTaskItem',
    method: 'put',
    data,
  });
}

/**
 * Created by zyj on 2019-11-8
 */
export function vipRegist(data) {
  return request({
    baseURL: apiUrl,
    url: 'vip/vipRegist',
    method: 'post',
    data,
  });
}
