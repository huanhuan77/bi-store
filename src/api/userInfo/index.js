/**
 * Created by zyj on 2019-12-3
 * 用户模块 user
 */
import request from '@/axios/api';
import baseURL from '../../../public/config/configUrl';

const { userUrl } = baseURL;
/**
 * 获取用户信息
 */
export function info(params) {
  return request({
    baseURL: userUrl,
    url: 'user/info',
    method: 'get',
    params,
  });
}

/**
 * Created by zyj on 2019-10-18
 * 获取首页菜单
 */
export function getMenu(params) {
  return request({
    baseURL: userUrl,
    url: 'role/menu',
    method: 'get',
    params,
  });
}
