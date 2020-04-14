<template>
  <nav class="tabbar">
    <router-link class="item" :to="item.path" v-for="(item,index) in menuList" :key="index">
      <div :class="`iconfont ${item.icon}`"></div>
      <span>{{item.title}}</span>
    </router-link>
  </nav>
  </nav>
</template>

<script>
  export default {
    name: 'tab-bar',
    data() {
      return {
        type: '',
        menuList: [],
      }
    },
    created() {
      this.type = parseInt(window.localStorage.getItem('type'))
      this.menuList = JSON.parse(window.localStorage.getItem('menuList'))
      if(!this.menuList) return
      this.menuList.forEach((item) => {
        if (item.path === '/') {
          item.path = (this.type === 3 || this.type === 4) ? '/home' : '/Supervisor'
        }
      })
    },
    methods: {},

  }
</script>

<style scoped lang="scss">
  .tabbar {
    width: 100%;
    height: vw(50);
    background: #f4f4f4;
    display: flex;
    justify-content: space-around;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 999;
    font-size: vw(17);
    border-top: 1px solid $tableBorder;

    .item {
      padding: vw(5);
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      font-size: vw(14);
      text-align: center;

      .iconfont {
        font-size: vw(20);
      }
    }
  }

  /*.tab-active{*/
  /*color: #4796F4;*/
  /*}*/
  a {
    color: #929292;
  }

  .router-link-active {
    color: $theme-color;
  }


</style>
