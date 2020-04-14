<template>
  <body>
  <div class="member_search">
    <span>店铺名称：</span>
    <input type="text" class="input" placeholder="请输入店铺名称/地址" v-model="storeName" @keyup.enter="search">
    <van-button type="default" class="search_button" @click="search">查询</van-button>
  </div>
  <template>
    <div class="table tableHead">
      <table border="0" cellspacing="0" cellpadding="0" rules="groups">
        <tbody>
        <tr>
          <td width="35%">店铺名称</td>
          <td>电话</td>
          <td width="35%">地址</td>
        </tr>
        </tbody>
      </table>
    </div>
  </template>
  <main id="#main">
    <div ref="main">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        :offset="10">
        <div class="table">
          <template v-for="(store,index) in storeList">
            <div class="line" :key="index">
              <div class="name" @click="storeClick(store)">{{store.storeName}}</div>
              <div :class="[store.tel==='暂无信息'?'tel1':'tel']" @click="call(store.tel)">{{store.tel}}</div>
              <div class="address" @click="storeClick(store)">{{store.address}}</div>
            </div>
            <!--展示弹出层-->
            <van-popup v-model="showTel" class="callTel" round>
              <div>
                <a :href='`tel:${store.tel}`'>
                  <van-icon name="phone-o"/>
                  呼叫</a>
                <a :href='`sms:${store.tel}`'>
                  <van-icon name="comment-o"/>
                  发送短信</a>
              </div>
            </van-popup>
          </template>
        </div>
      </van-list>
    </div>
    <yd-backtop bottom="140px"></yd-backtop>
  </main>

  <van-popup v-model="show" position="bottom" round :style="{ height: '35%'}">
    <div style="position: relative">
      <van-cell style="font-weight: bold;background: #F8F8F8">店铺信息</van-cell>

      <div class="item">
        <span class="_name">店仓号：</span>
        <span>{{storeInfo.storeId}}</span>
      </div>

      <div class="item">
        <span class="_name">店铺名称：</span>
        <span>{{storeInfo.storeName}}</span>
      </div>

      <div class="item">
        <span class="_name">电话：</span>
        <span>{{storeInfo.tel}}</span>
      </div>

      <div class="item">
        <span class="_name">地址：</span>
        <span>{{storeInfo.address}}</span>
      </div>
      <van-icon name="close" class="closeIcon" @click="closePopup"/>
    </div>
  </van-popup>
  </body>
</template>

<script>
  import { storeSearch } from '@/api/work';

  export default {
    name: 'storeSearch',
    data() {
      return {
        storeName: '',
        storeList: [],
        pageSize: 15,
        pageNumber: 1,
        storeInfo: {},
        show: false,
        loading: false,
        finished: false,
        scroll: '',
        showTel: false,
      };
    },

    mounted() {
      const main = document.getElementById('#main');
      main.addEventListener('scroll', this.handleScroll);
    },
    activated() {
      const main = document.getElementById('#main');
      if (this.scroll > 0) {
        main.scrollTo(0, this.scroll);
        this.scroll = 0;
        main.addEventListener('scroll', this.handleScroll());
      }
    },
    methods: {
      call(tel) {
        if (tel === '暂无信息') return;
        this.showTel = true;
      },
      handleScroll() {
        const main = document.getElementById('#main');
        this.scroll = main.scrollTop;
      },
      search() {
        this.storeName = this.storeName.trim();
        if (this.storeName == '') {
          this.$toast({
            message: '请输入店铺名称或者地址',
            duration: 800,
          });
          return;
        }
        this.pageNumber = 1;
        this.getList();
        const main = document.getElementById('#main');
        main.scrollTop = 0;
      },
      getList() {
        storeSearch({
          searchText: this.storeName,
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
        })
          .then((res) => {
            if (res.data.total === 0) {
              this.$toast('没有数据!');
              this.storeList = [];
            } else {
              this.storeList = res.data.list;
              this.finished = false;
            }
          })
          .catch(() => {
            this.storeList = [];
            this.finished = false;
          });
      },
      storeClick(store) {
        this.storeInfo = store;
        this.show = true;
      },
      onLoad() {
        this.pageNumber += 1;
        this.loading = true;
        const { storeList } = this;
        setTimeout(() => {
          storeSearch({
            searchText: this.storeName,
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
          })
            .then((res) => {
              this.loading = false;
              this.storeList = storeList.concat(res.data.list);
              if (this.storeList.length >= res.data.total) {
                this.finished = true;
              } else {
                this.finished = false;
              }
            });
        }, 1000);
      },
      closePopup() {
        this.show = false;
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "@/assets/style/member-public.scss";


  .tableHead {
    /*font-size: vw(14);*/
    background: #fff;
    margin-top: vw(8);
    height: vw(30);
    line-height: vw(30);
    color: $gray_color;
    border-bottom: 1px solid $tableBorder;
  }

  .table {
    /*overflow-x: scroll;*/
    padding: 0 vw(8);
    height: auto;
    background: #fff;

    table {
      width: 100%;

      td {
        font-size: vw(12) !important;
        border-bottom: 1px solid $tableBorder;
        text-align: center;
        height: vw(30);
        line-height: vw(30);
        /*text-overflow:ellipsis;*/
        /*white-space: nowrap;*/
        /*overflow: hidden;*/
        span {
          display: inline-block;
          /*border-bottom: 1px solid #E5E5E5;*/
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          /*display: block;*/
        }

      }
    }
  }


  .line {
    width: 100%;
    background: #fff;
    height: vw(40);
    line-height: vw(40);
    border-bottom: 1px solid $tableBorder;
    min-height: vw(40);

    div {
      font-size: vw(13) !important;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .name {
      width: 35%;
    }

    .address {
      width: 35%;
      text-align: center;
    }

    .tel {
      width: 30%;
      text-align: center;
      color: #10AEFF;
    }

    .tel1 {
      width: 30%;
      text-align: center;
    }
  }

  .van-cell {
    height: vw(40);
    line-height: vw(40);
    padding: 0 vw(10);
  }

  .item {
    font-size: vw(14);
    width: 100%;
    background: #fff;
    height: auto;
    //border-bottom: 1px solid $tableBorder;
    padding: vw(8) vw(10);
    display: flex;

    ._name {
      width: vw(75);
      display: inline-block;
    }

    span:nth-child(2) {
      color: #999;
    }
  }

  .closeIcon {
    position: absolute;
    top: vw(10);
    right: vw(15);
    font-size: vw(20);
    color: #ccc;
  }

  .closeIcon:active {
    color: #10AEFF;
  }

  .callTel {
    width: 80%;

    a {
      font-size: vw(18);
      height: vw(60);
      line-height: vw(60);
      padding: 0 vw(30);
      border-bottom: 1px solid $border_color;
      display: flex;
      justify-content: start;
      align-items: center;

      i {
        font-size: vw(18);
        margin-right: vw(10);
      }
    }
  }
</style>
