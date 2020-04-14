<template>
  <div id="app">
    <transition name="fade">
      <Splash v-show="splash"></Splash>
    </transition>
    <HeaderBar :flag="flag" :flagInfo="flagInfo" v-if="!isLogin&&!splash&&isExchange" :work="work"></HeaderBar>

    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>

    <router-view v-if="!$route.meta.keepAlive">
      <!-- 这里是不被缓存的视图组件 -->
    </router-view>

    <TabBar v-if="!isLogin&&!splash&&isExchange"></TabBar>
  </div>
</template>


<script>
  import Splash from '@/components/splash.vue'
  import TabBar from '@/components/tabBar.vue'
  import HeaderBar from '@/components/header-bar.vue'
  import Watermark from '@/watermark'
  import store from './store'

  export default {
    data() {
      return {
        flag: false,
        flagInfo: false,
        isLogin: false, // 登录  错误页
        work: false,//任务管理
        splash: false,
        type: window.localStorage.getItem('type'),
        isError: false,
        allowBack: '',
        isExchange: true,//导购页
      }
    },
    created() {
      let url = window.location.href
      let str = url.split('/')[4]
      if (str.indexOf('?') === 0 || !str) {
        this.splash = true
      }
    },
    components: {
      TabBar,
      HeaderBar,
      Splash,
    },
    watch: {
      '$route.path'(newVal, oldVal) {
        this.flag = !(newVal === '/home' || newVal === '/memberMain' || newVal === '/workMain' || newVal === '/userInfo' || newVal === '/Supervisor')
        // this.work = newVal === '/workMain/recruitIndicator' || newVal === '/workMain/valueIndicator' || newVal === '/workMain/performanceIndicator';
        this.flagInfo = newVal === '/userInfo'
        // 登录页  错误页不显示头部和底部
        this.isLogin = this.$route.path === '/' || this.$route.path === '/userNotFound' || this.$route.path === '/error'
        this.splash = newVal === '/'
      },
      '$route.name'(val) {
        this.isExchange = val !== 'exchange';
      }
    },
    mounted() {
      this.allowBack = store.state.allowBack
      window.onpopstate = () => {
        if (!this.allowBack) {    //    这个allowBack 是存在vuex里面的变量
          history.go(1)
        }
      }
      if (!this.splash && !this.isLogin) Watermark.set(`${window.localStorage.getItem('name') || ''} HONGU`)
    },
    updated() {
      this.allowBack = store.state.allowBack
      window.onpopstate = () => {
        if (!this.allowBack) {    //    这个allowBack 是存在vuex里面的变量
          history.go(1)
        }
      }
      if (!this.splash && !this.isLogin) Watermark.set(`${window.localStorage.getItem('name') || ''} HONGU`)
    },
  }
</script>

<style lang="scss">
  @import "./assets/font/font.css";

  #app {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*text-align: center;*/
    color: #2c3e50;
    padding-top: vw(40);
    padding-bottom: vw(50);
    background-color: #fff;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }

  .v-enter {
    opacity: 0;
    transform: translateX(100%);
  }

  .v-leave-to {
    opacity: 0;
    transform: translateX(-100%);
    position: absolute;
  }

  .v-enter-active,
  .v-leave-active {
    transition: all 0.5s ease;
  }

</style>
