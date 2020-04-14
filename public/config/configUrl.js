/**
 *定义各个API的baseURL
*/
let baseURL = '';
switch (process.env.NODE_ENV) {
  // 开发环境
  case 'development':
    baseURL = {
      apiUrl: 'http://192.168.20.31:8084/api/',
      authUrl: 'http://192.168.4.75:9999/hg-auth/', // 授权地址 获取token
      // authUrl: 'http://192.168.4.75:8888/',
      userUrl: 'http://192.168.4.75:8088/', // 获取用户信息
    };
    break;
    // 线上环境
  case 'production':
    baseURL = {
      apiUrl: 'http://portal.honggu.cn:8000/bi-store/',
      authUrl: 'http://portal.honggu.cn:8000/hg-auth/', // 授权地址 获取token
      userUrl: 'http://portal.honggu.cn:8000/hg-admin/', // 获取用户信息
    };
    break;
  default:
}
export default baseURL;

