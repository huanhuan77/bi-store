<template>
  <body>
  <div class="tiaoguo" v-if="timeShow" @click="finish">
    <van-count-down :time="time" format="跳过(ss)" @finish="finish"></van-count-down>
  </div>
  <!--<div class="splash">-->
  <!--<transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">-->
  <!--<div class="slide" v-show="visible">-->
  <!--<img src="@/assets/image/logo1.png" alt="">-->
  <!--<div class="line"><i></i></div>-->
  <!--</div>-->
  <!--</transition>-->
  <!--<transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">-->
  <!--<div class="span" v-if="visible">-->
  <!--<span>顾客至上</span>-->
  <!--<span>锐意进取</span>-->
  <!--</div>-->
  <!--</transition>-->
  <!--</div>-->
  <!--<transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">-->
  <!--<p v-if="visible">生意参谋</p>-->
  <!--</transition>-->
  </body>
</template>

<script>
import { code } from '@/api/auth';
import { info, getMenu } from '@/api/userInfo';

export default {
  name: 'login',
  data() {
    return {
      code: 0,
      time: 4000,
      timeShow: false,
    };
  },
  created() {
    // 获取企业微信静默登录code
    this.code = this.$route.query.code ? this.$route.query.code : 0;
    this.login();
  },
  methods: {
    // 静默登录
    login() {
      // 通过code获取token，用于权限验证
      code({
        code: this.code,
      })
        .then(({ data }) => {
          console.log(data)
          window.localStorage.setItem('token', data.access_token);
          window.localStorage.setItem('refresh_token', data.refresh_token);
          window.localStorage.setItem('expires_in', data.expires_in);
          this.getInfo();
        });
    },
    getInfo() {
      // 通过token获取用户信息
      info()
        .then(({ data }) => {
          const _res = JSON.stringify(data.sysUser);
          // 用户类型
          window.localStorage.setItem('userType', data.userType);
          // 用户信息
          const userInfo = data.sysUser;
          window.localStorage.setItem('userInfo', _res);
          window.localStorage.setItem('name', userInfo.name);
          window.localStorage.setItem('avatar', userInfo.avatar);
          window.localStorage.setItem('type', userInfo.type);
          window.localStorage.setItem('username', userInfo.mobile);
          window.localStorage.setItem('iposUserid', userInfo.iposUserid);

          // 店铺信息
          const { stores } = data;
          window.localStorage.setItem('listStore', JSON.stringify(stores));
          window.localStorage.setItem('storeNo', stores[0].storeNo);
          window.localStorage.setItem('storeName', stores[0].storeName);
          window.localStorage.setItem('areaName', stores[0].areaName);
          window.localStorage.setItem('channelNo', stores[0].channelNo);
          window.localStorage.setItem('id', stores[0].id);
          window.localStorage.setItem('address', stores[0].address || '');
          window.localStorage.setItem('tel', stores[0].tel || '');
          this.getMenu();
        });
    },
    getMenu() {
      getMenu({ terminal: 1 }).then(({ data }) => {
        // this.menuList = data
        this.timeShow = true;
        window.localStorage.setItem('menuList', JSON.stringify(data));
      }).catch(() => {
        this.$toast({
          message: '获取菜单失败！',
          type: 'warning',
        });
      });
    },
    finish() {
      const type = parseInt(window.localStorage.getItem('type'));
      if (type === 3 || type === 4) {
        this.$router.replace({ name: 'shouye' });
      } else {
        // 督导 /老板
        this.$router.replace({ name: 'Supervisor' });
      }
    },
  },
};
</script>

<style scoped lang="scss">
  body {
    width: 100%;
    height: 0;
    background-color: #fff;
    position: relative;
    font-family: 'Microsoft YaHei', serif;

    p {
      font-size: vw(16);
      color: $theme-color;
      position: absolute;
      bottom: vw(-30);
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .tiaoguo {
    padding: vw(3) vw(10);
    border: 1px solid #f4f4f4;
    border-radius: vw(20);
    //background-color: $body_background_color;
    position: absolute;
    top: vw(-10);
    right: vw(10);
    z-index: 999;

    .van-count-down {
      color: #999;
    }
  }

  .splash {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: relative;
    /*display: flex;*/
    /*background: url("../assets/image/start.png") center top;*/

    img {
      width: 100%;
      height: 100%;
    }

    .slide {
      width: vw(170);
      margin: vw(60) auto;
      display: flex;
      align-items: center;
      flex-direction: column;
      position: relative;

      .line {
        display: block;
        width: vw(150);
        height: vw(1);
        background-color: #f6f6f6;
        position: relative;
        margin: vw(10) 0 vw(40);

        i {
          position: absolute;
          top: vw(-5);
          left: 50%;
          transform: translateX(-50%);
          width: vw(10);
          height: vw(10);
          background-color: #f6f6f6;
          border-radius: 50%;
          border: vw(3) solid #fff;
        }
      }

    }

    .span {
      width: vw(60);
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        display: block;
        font-size: vw(22);
        color: $theme-color;
        width: vw(20);
        line-height: vw(28);
        letter-spacing: vw(8);
        margin-top: vw(50);
        /*writing-mode: vertical-lr;!*从左向右 从右向左是 writing-mode: vertical-rl;*!*/
      }

      span:first-of-type {
        margin-top: vw(-100);
        margin-right: vw(20);
      }

      span:last-of-type {
        margin-left: vw(20);
      }


    }
  }

  .fade-enter-active, .fade-leave-active {
    /*transition: opacity 0.5s*/
  }

  .fade-enter, .fade-leave-to {
    /*opacity: 0*/
  }
</style>
