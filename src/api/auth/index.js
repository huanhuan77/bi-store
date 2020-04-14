/**
 * Created by DONG on 2019-07-03.
 * 权限模块 auth
 */
import request from '@/axios/api';
import baseURL from '../../../public/config/configUrl';

const { authUrl } = baseURL;
/**
 * 获取token
 */
export function code(params) {
  return request({
    baseURL: authUrl,
    url: 'auth/code',
    method: 'get',
    params,
  });
}

/**
 *  刷新token
*/
export function refreshToken(params) {
  return request({
    baseURL: authUrl,
    url: 'oauth/token',
    method: 'get',
    params,
  });
}

/**
 * 退出登录
 */
export function logout(params) {
  return request({
    baseURL: authUrl,
    url: 'token/logout',
    method: 'delete',
    params,
  });
}
