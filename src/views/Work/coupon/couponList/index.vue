<template>
  <body>
  <!--<div class="member_search">-->
  <!--<span>优惠券：</span>-->
  <!--<input type="text" class="input" placeholder="请输入优惠券名称" v-model="input" @change="inputChange">-->
  <!--<van-button type="default" class="search_button" @click="search">查询</van-button>-->
  <!--</div>-->
  <MenuButton :typeList="stateList" @changeType="changeState"
              :typeIndex="status" class="stateList">
  </MenuButton>
  <template>
    <main>
      <template v-if="list.length!==0">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了~" error-text="请求失败，点击重新加载"
                  :immediate-check="false" @load="onLoad" :offset="10">
          <div class="couponBox">
            <div class="couponItem" v-for="(item,index) in list" :key="index">
              <div :class="[status?'itemHeader display':'itemHeader']">
                <p class="discount" v-if="item.money===0">{{item.rebate}}折</p>
                <p class="discount" v-else>{{item.money}}元</p>
              </div>
              <div class="itemBottom">
                <p>名称：{{item.couponName}}
                  <van-tag type="primary" class="tagStyle" v-if="item.send&&!listFlag">已发券
                  </van-tag>
                  <van-tag type="warning" class="tagStyle" v-if="item.isDiscont">券不足</van-tag>
                </p>
                <p v-if="item.endTime!=='长期有效'">有效期：{{item.startTime}} 至 {{item.endTime}}</p>
                <p v-else>有效期：{{item.endTime}}</p>
                <p v-html="item.remark" class="remark"></p>
                <span class="couponButton" @click="send(item.recordCode)"
                      v-if="!status&&!listFlag&&!item.send&&!item.isDiscont">发送</span>
                <span class="couponButton" @click="goToDetail(item.recordCode)" v-if="listFlag">已发券列表</span>
              </div>
            </div>
          </div>
        </van-list>
      </template>
      <template v-else>
        <div class="noCoupon">
          <img src="@/assets/image/coupon-empty.png" alt="">
          <span>暂无优惠</span>
        </div>
      </template>
      <!--</van-popup>-->
      <!--<div class="table">-->
      <!--<table border="0" cellspacing="0" cellpadding="0" rules="groups">-->
      <!--<tbody>-->
      <!--<van-list-->
      <!--:offset="10"-->
      <!--:immediate-check="false">-->
      <!--<tr v-for="(item,index) in list" :key="index">-->
      <!--<td width="40%" style="color: rgb(15, 144, 210);" @click="getCouponDetail(index)">{{item.couponName}}-->
      <!--</td>-->
      <!--<td width="40%">{{item.remark}}</td>-->
      <!--<td width="20%">-->
      <!--<van-button type="default" class="button" plain @click="goToDetail(item.recordCode)">查看</van-button>-->
      <!--</td>-->
      <!--</tr>-->
      <!--</van-list>-->
      <!--</tbody>-->
      <!--</table>-->
      <!--<div class="noData" v-show="list.length===0">-->
      <!--暂无数据-->
      <!--</div>-->
      <!--</div>-->
      </div>
      <yd-backtop bottom="140px"></yd-backtop>
    </main>
  </template>

  </body>
</template>

<script>
  import Vue from 'vue';
  import { Dialog } from 'vant';
  // 全局注册
  Vue.use(Dialog);
  import MenuButton from '@/components/menu-button.vue';
  import { couponStoreList, sendCoupon } from '@/api/coupon/index';

  export default {
    name: 'couponList',
    components: {
      MenuButton,
    },
    data() {
      return {
        pageSize: 6,
        pageNumber: 1,
        stateList: [
          {
            value: 0,
            name: '可用优惠券',
            number: 0,
          },
          {
            value: 1,
            name: '已失效优惠券',
            number: 0,
          },
        ],
        input: '',
        loading: false,
        finished: false,
        list: [],
        status: 0,
        storeId: window.localStorage.getItem('storeNo'),

        vipMobile: '',
        vipCode: '',
        listFlag: false,
      };
    },
    created() {
      this.listFlag = this.$route.query.list;
      this.vipMobile = this.$route.query.vipMobile;
      if (this.$route.query.vipCode) this.vipCode = this.$route.query.vipCode;
      this.getCouponList();
    },
    methods: {
      search() {
        this.input = this.input.trim();
        if (this.input === '') {
          this.$toast({
            message: '请输入优惠券名称',
            duration: 800,
          });
          return;
        }
        this.getCouponList();
      },
      inputChange() {
        if (this.input === '') this.getCouponList();
      },
      getCouponList() {
        couponStoreList({
          storeId: this.storeId,
          status: this.status,
          search: this.input,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
          vipCode: this.vipCode,
        })
          .then(({ data }) => {
            this.list = data.data;
            this.total = data.totalCount;
          })
          .catch(() => {
            this.list = [];
            this.total = 0;
          });
      },
      getCouponDetail(index) {
        // if(this.status) return
        this.$router.push({
          name: 'couponDetail',
          query: {
            index,
            status: this.status,
            vipMobile: this.vipMobile,
          }
        });
      },
      goToDetail(recordCode) {
        if (this.vipMobile) return;
        //优惠券明细
        this.$router.push({
          name: 'couponInfo',
          query: { recordCode }
        });
      },
      changeState(id) {
        // 防止重复加载
        if (this.status === id) return;
        this.status = id;
        this.list = [];
        this.input = '';
        this.pageNumber = 1;
        this.getCouponList();
      },
      onLoad() {
        if (this.list.length < this.pageSize) {
          this.loading = false;
          this.finished = true;
        } else {
          const { list } = this;
          setTimeout(() => {
            this.pageNumber += 1;
            couponStoreList({
              storeId: this.storeId,
              status: this.status,
              search: this.input,
              pageSize: this.pageSize,
              pageNumber: this.pageNumber,
              vipCode: this.vipCode,
            })
              .then(({ data }) => {
                this.loading = false;
                this.total = data.totalCount;
                this.list = list.concat(data.data);
                if (this.list.length >= data.totalCount) {
                  this.finished = true;
                }
              });
          }, 500);
        }
      },
      send(recordCode) {
        Dialog.confirm({
          title: '提示',
          message: '确认发送优惠券？'
        })
          .then(() => {
            //发券
            sendCoupon({
              userName: window.localStorage.getItem('username'),
              name: window.localStorage.getItem('name'),
              recordCode: recordCode,
              customerTel: this.vipMobile,
              vipCode: this.vipCode,
            })
              .then(({ msg }) => {
                this.$toast({
                  message: `${msg}`,
                  duration: 2000,
                });
                this.getCouponList();
              });
          })
          .catch(() => {
            // on cancel
          });
      },
    }
  };
</script>

<style scoped lang="scss">
  @import "@/assets/style/member-public.scss";
  @import "@/assets/style/coupon.scss";

  /*不滚动内容*/
  .tableHead {
    padding: 0 vw(10);
    font-size: vw(14);
    background: #fff;
    margin-top: vw(8);
    height: vw(30);
    line-height: vw(30);
    color: $gray_color;
    border-bottom: 1px solid #E5E5E5;
  }

  /*滚动区域*/
  .mm-content {
    .table {
      padding: 0 vw(10);
    }
  }

  .table {
    font-size: vw(14);
    height: auto;
    background: #fff;
    width: 100%;

    table {
      width: 100%;

      td {
        border-bottom: 1px solid #E5E5E5;
        text-align: center;
        height: vw(36);
        line-height: vw(36);
        text-overflow: ellipsis;
        vertical-align: middle;
      }
    }
  }


  .van-list {
    width: 100%;

    tr {
      display: flex;
      /*width: 100%;*/
      td {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .button {
    height: vw(26);
    line-height: vw(26);
    padding: 0 vw(10);
    border: 1px solid $theme-color;
    color: $theme-color;
    border-radius: vw(6);

    span {
      font-size: vw(12);
    }
  }

  .color {
    color: rgb(15, 144, 210);
  }

</style>
