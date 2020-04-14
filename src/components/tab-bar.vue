<template>
  <div class="tabbar" >
      <div class="item"
           :class="[tabIndex==tab.id ?'tab-active':'']"
           v-for="tab in tabList" :key="tab.id" @click="changeTab(tab.id)">
        <div class="iconfont" :class="tab.icon"></div>
        <span>{{tab.name}}</span>
      </div>
  </div>
</template>

<script>
export default {
  name: 'tab-bar',
  props: {
    tabIndex: Number,
  },
  data() {
    return {
      tabList: [{
        id: 1,
        name: '首页',
        icon: 'icon-shouye',
      },
      {
        id: 2,
        name: '会员',
        icon: 'icon-huiyuan',
      },
      {
        id: 3,
        name: '工作台',
        icon: 'icon-gongzuotai',
      }],
    };
  },
  methods: {
    changeTab(index) {
      this.$emit('changeTab', index);
      if (index == 1) {
        this.$router.push({ name: 'shouye' });
      } else if (index == 2) {
        this.$router.push({ name: 'memberMain' });
      } else if (index == 3) {
        this.$router.push({ name: 'workMain' });
      }
    },
  },

};
</script>

<style scoped lang="scss">
  .tabbar {
    height: vw(50);
    background: #f4f4f4;
    display: flex;
    justify-content: space-around;
    position: relative;
    font-size: vw(17);
   .item{
     padding: vw(5);
     display: flex;
     justify-content: space-around;
     flex-direction: column;
     font-size: vw(14);
     text-align: center;
     .iconfont{
       font-size: vw(20);
     }
   }
  }
  .tab-active{
      color: #4796F4;
  }
</style>
