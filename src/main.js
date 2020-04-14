import Vue from 'vue';
import Vant from 'vant';
import 'vant/lib/index.css';
import YDUI from 'vue-ydui';
import 'vue-ydui/dist/ydui.rem.css';
import 'amfe-flexible/index.js';
import imgUrl from '@/api/imgUrl';// 图片服务器地址
import $ from 'jquery';
import animate from 'animate.css';
import './filter';
import echarts from 'echarts';
import wx from 'weixin-js-sdk';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store';
import App from './App.vue';
import router from './router/router';

Vue.prototype.$wx = wx;// 微信jdk
Vue.prototype.$ = $; // jquery
Vue.prototype.imgUrl = imgUrl;// 图片服务器地址
Vue.prototype.$echarts = echarts;// echarts
Vue.use(YDUI);
Vue.use(Vant);
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.use(animate);
// import VConsole fronm 'vconsole';
//
// const vConsole = new VConsole(); // 不使用的时候，可以将这句屏蔽掉；

// const str = navigator.userAgent.toLowerCase();
// const ver = str.match(/cpu iphone os (.*?) like mac os/);
//
// if (!ver || parseInt(ver[1]) < 11) { // 非IOS系统或者系统版本小于11
//   // 引入fastclick 做相关处理
//   FastClick.attach(document.body); // 使用 fastclick
// }


// 页面修改时修改浏览器标签栏
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();

  let allowBack = true; //    给个默认值true
  if (to.meta.allowBack !== undefined) {
    allowBack = to.meta.allowBack;
  }
  if (!allowBack) {
    // 禁止回退
    history.pushState(null, null, location.href);
  }
  store.dispatch('updateAppSetting', allowBack);
});


// 企业微信登录控制
// const ua = window.navigator.userAgent.toLowerCase();
// if (ua.match(/MicroMessenger/i) == 'micromessenger') {
//   // WeixinJSBridge.call('hideOptionMenu');// 禁用分享
// } else {
//   router.push({ name: 'error' }); // 跳到错误页面  正式环境下
//   // router.push({ name: 'login' }); // 跳到登录页面   测试环境
// }

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
