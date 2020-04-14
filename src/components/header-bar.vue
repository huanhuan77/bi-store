<template>
  <div>
    <div class="headerBox">
      <div @click="goBack" v-show="flag" class="span">
        <van-icon name="arrow-left" class="back"></van-icon>
      </div>
      <div v-if="!flagInfo&&(type==3||type==4)">
        <span class="title">{{storeName}}</span>
      </div>
      <div v-show="!flagInfo"> {{name}}</div>
      <div v-show="!flagInfo">{{role}}</div>
      <div style="margin: 0 auto;" v-show="flagInfo">个人信息</div>
    </div>
    <van-popup
      v-model="show"
      position="right"
      :style="{ height: '100%',width:'80%'}">
      <div class="box">
        <van-cell style="background:#f4f4f4 ">请选择店铺</van-cell>
        <van-cell>
          <input type="text" placeholder="请输入店铺" id="header_input">
          <van-button type="default" class="search_button" @click="search">查询</van-button>
        </van-cell>
        <div class="main">
          <van-radio-group v-model="storeName">
            <van-cell-group v-for="(item,index) in storeList" :key="index">
              <van-cell :title="item.storeName" :class="[storeName==item.storeName?'cell_active':'']"
                        @click="selectStore(item)">
                <van-icon name="success" :class="[storeName==item.storeName?'icon_active':'']" id="van-icon"></van-icon>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
        <div class="bottom">
          <van-button type="default" id="sure" @click="sure">确定</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import { listUserStore } from '@/api/auth';

  export default {
    name: 'header-bar',
    data() {
      return {
        storeName: '', // 默认选中的店铺
        type: '',
        name: '',
        role: '',
        show: false,
        storeList: [],
        selectStoreName: '', // 新选择的店铺
        storeNo: 0,
      };
    },
    created() {
      this.role = window.localStorage.getItem('userType');
      // console.log('头部组件');
      // console.log(`${this.storeName}header页面`);
    },
    mounted() {
      this.name = window.localStorage.getItem('name');
      this.storeName = window.localStorage.getItem('storeName');
      this.type = window.localStorage.getItem('type');
      this.selectStoreName = this.storeName;
      this.role = window.localStorage.getItem('userType');
      // if (this.type == 1) {
      //   this.role = '管理员'; // 个人  店铺
      // } else if (this.type == 2) {
      //   this.role = '总部人员'; // 店铺
      // } else if (this.type == 3) {
      //   this.role = '店长'; // 个人  店铺
      // } else {
      //   this.role = '店员'; // 看个人
      // }
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      showPop() {
        this.show = true;
        this.listUserStore();
      },
      listUserStore() {
        listUserStore()
          .then((res) => {
            this.storeList = res.data;
          });
      },
      selectStore(item) {
        // this.selectStoreName = item.storeName;
        // this.storeNo = item.storeNo;
        window.localStorage.setItem('storeName', item.storeName);
        this.storeName = item.storeName;
        this.storeName = window.localStorage.getItem('storeName');
        window.localStorage.setItem('storeNo', item.storeNo);
        this.$router.push({ name: 'shouye' });
      },
      sure() {
        this.show = false;
        this.storeName = this.selectStoreName;
        window.localStorage.setItem('storeNo', this.storeNo);
        window.localStorage.setItem('storeName', this.storeName);
        this.$router.push({ name: 'shouye' });
      },
      search() {

      },
    },
    props: ['flag', 'flagInfo'],
  };
</script>

<style lang="scss">
  .headerBox {
    width: 100%;
    background: $theme-color;
    height: vw(40);
    padding: 0 vw(10) 0 vw(10);
    font-size: vw(14);
    color: #fff;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;

    div {
      margin: 0 vw(6);
    }

    .span {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      padding: vw(10);
    }

    .userInfo {
      font-size: vw(20);
      width: vw(40);
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      line-height: vw(44);
      text-align: center;
    }

    .back {
      font-size: vw(20);
    }
  }

  .title {
    display: block;
    width: vw(200);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }

  #van-icon {
    display: none;
    font-size: vw(25);
  }

  .icon_active {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 5%;
    display: block !important;
    font-size: vw(25);
    color: #d70d17;
  }

  .cell_active {
    background: #f3f1f1 !important;
  }

  .box {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .main {
    height: 0;
    flex-grow: 1;
    overflow-y: scroll;
  }

  .bottom {
    height: vw(50);
    line-height: vw(50);
    border-top: 1px solid $border_color;
    text-align: right;
    padding-right: vw(15);
  }

  #header_input {
    height: vw(30);
    line-height: vw(25);
    border: none;
    background: #F7F8FA;
    padding-left: vw(10);
  }

  .search_button {
    //background: $theme-color;
    //color: #fff;
    //position: absolute;
    //top: 50%;
    //transform: translateY(-50%);
    //right: vw(0);
    //font-size: vw(14);
    //width: vw(60);
    //height: vw(30);
    //line-height: vw(30);
  }

  #sure {
    height: vw(30);
    line-height: vw(30);
    background: #0F90D2;
    color: #fff;
  }


</style>
