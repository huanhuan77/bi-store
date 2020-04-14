/**
 * Created by DONG on 2019-07-03.
 * 拦截器
 * 资源API请求
 */
import axios from 'axios';
import { Toast, Loading } from 'vue-ydui/dist/lib.rem/dialog';
import { Dialog } from 'vant';
import router from '../../router/router';
// import { refreshToken } from '@/api/auth';
import whiteList from '../whiteList';
import baseURL from '../../../public/config/configUrl';
// 创建一个错误
function errorCreate(msg) {
  const err = new Error(msg);
  throw err;
}

function getRfreshTokenFunc() {
  const params = {
    grant_type: 'refresh_token',
    refresh_token: window.localStorage.getItem('refresh_token'),
  };
  const headers = {
    Authorization: 'Basic Ymk6Ymk=',
  };
  return axios.get(`${baseURL.authUrl}oauth/token`, {
    params, headers,
  });
}
// 是否正在刷新
let isRefreshing = false;
// 被挂起的请求数组
let refreshSubscribers = [];

const service = axios.create({
  timeout: 6000 * 10,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    Loading.open('加载中');

    // 不显示加载中页面的接口  没有出现返回-1
    if (whiteList.loading.indexOf(config.url) !== -1) {
      Loading.close();
    }
    // 需要店铺id
    if (whiteList.nullStoreId.indexOf(config.url) === -1) {
      // 注入店铺ID,店铺切换是需更新storeNo
      if (config.method === 'get') {
        config.params.storeId = window.localStorage.getItem('storeNo');
      } else {
        config.data.storeId = window.localStorage.getItem('storeNo');
      }
    }

    let token = `Bearer ${window.localStorage.getItem('token')}`;
    // 需要授权代码
    if (whiteList.AuthorizationCode.indexOf(config.url) !== -1) {
      token = 'Basic Ymk6Ymk=';// 应用授权代码
    }

    // 添加headers参数  不添加token的接口
    if (token && whiteList.nullToken.indexOf(config.url) === -1) {
      config.headers.Authorization = token;
    }
    return config;
  },
  ((error) => {
    // 对请求错误的处理
    Toast({
      mes: '请求失败',
      icon: 'error',
    });
    return Promise.reject(error);
  }),
);

// 响应拦截器
service.interceptors.response.use((response) => {
  Loading.close();
  // 对响应数据处理
  const { code } = response.data;

  switch (code) {
    case 0:
      return response.data;
    case 1: // 错误
      Dialog.alert({
        message: response.data.msg,
      }).then(() => {
      });
      break;
    case 401: // 请重新登录 // 无权限
      setTimeout(() => {
        router.replace({
          name: 'userNotFound',
          query: { info: response.data.msg },
        }, 1000);
      });
      break;
    default:
      // 不是正确的code   抛出异常
      errorCreate(Toast({
        mes: `${response.data.msg}`,
        icon: 'error',
      }));
  }
},
((error) => {
  Loading.close();
  const { config } = error;
  if (error && error.response) {
    switch (error && error.response.status) {
      case 400:
        Toast({
          mes: '对不起,页面走丢了(400)',
          icon: 'error',
        });
        break;
      case 401:
        // 判断是否正在刷新
        if (error.response.data.code === 400) {
          if (!isRefreshing) {
            // 将刷新token的标准设为true
            isRefreshing = true;
            return getRfreshTokenFunc()
              .then((res) => {
                isRefreshing = false;
                // 更新 token refresh_token
                window.localStorage.setItem('token', res.data.access_token);
                window.localStorage.setItem('refresh_token', res.data.refresh_token);
                // 成功刷新token
                const token = `Bearer ${res.data.access_token}`;
                config.headers.Authorization = token;
                config.baseURL = '';
                // 执行数组里的函数,重新发起被挂起的请求
                refreshSubscribers.forEach(cb => cb(token));

                // 执行完成后，清空队列
                refreshSubscribers = [];

                // 字符串转换为json
                if (config.data) {
                  const obj = config.data;
                  const ret = JSON.parse(obj);
                  config.data = ret;
                }
                return service(config);
              })
              .catch((err) => {
                console.log('refresh token error', err);
                if (err.response.status === 426) {
                  Dialog.alert({
                    message: '登录已失效,请重新登录!',
                  }).then(() => {
                    WeixinJSBridge.call('closeWindow');
                    window.localStorage.clear();
                  });
                }
              })
              .finally(() => {
                isRefreshing = false;
              });
          }
          const retry = new Promise((resolve, reject) => {
            refreshSubscribers.push((token) => {
              // 因为config中的token是旧的，所以刷新token后要将新token传进来
              config.baseURL = '';
              config.headers.Authorization = token;

              // 字符串转换为json
              if (config.data) {
                const obj = config.data;
                const ret = JSON.parse(obj);
                config.data = ret;
              }
              resolve(service(config));
            });
          });
          return retry;
        }

        break;
      case 403:
        Toast({
          mes: '服务器繁忙,请稍后重试(403)',
          icon: 'error',
        });
        break;
      case 404:
        Toast({
          mes: '请求地址出错(404)',
          icon: 'error',
        });
        break;
      case 408:
        Toast({
          mes: '请求超时,请重新登录(408)',
          icon: 'error',
        });
        break;

      case 500:
        Toast({
          mes: '服务器繁忙,请稍后重试(500)',
          icon: 'error',
        });
        break;
      case 503:
        Toast({
          mes: '服务器繁忙,请稍后重试(503)',
          icon: 'error',
        });
        break;
      case 504:
        Toast({
          mes: '网络超时,请检查网络(504)',
          icon: 'error',
        });
        break;
      default:
        break;
    }
  } else {
    Toast({
      mes: '连接服务器失败',
      icon: 'error',
    });
  }
  return Promise.reject(error);
}));

export default service;
