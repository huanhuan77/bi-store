<template>
  <body>
  <main id="#main">
    <div class="createIcon" @click="selectSure">
      <div class="iconfont icon-queding"></div>
      <div class="text">确定</div>
    </div>
    <van-sticky :offset-top="offsetTop">
      <div class="list_header" style="margin-top: 0;">
        <div class="list_box">
          <span class="list_name">会员列表</span>
          <span class="list_name">( {{total}}人 )</span>
          <span class="list_name" style="margin-left: 50px;">已选 <span
            style="color: #f00;">{{selectMember.length}}</span> 人</span>
          <van-button type="default" size="small" :class="[screen?'select screen':'select']" @click="fiterList">筛选
          </van-button>
        </div>
      </div>
    </van-sticky>
    <div class="mm-content" v-if="status=='0'">
      <van-list v-model="loading" :finished="finished" finished-text="" error-text="请求失败，点击重新加载"
                :immediate-check="false"
                @load="onLoad" :offset="10">
        <div class="go_or_down_list">
          <template v-if="list.length !==0">
            <div class="list_main">
              <yd-checklist align="right" color="#4F77AA" v-model="selectMember" ref="checklistDemo"
                            :callback="listChange">
                <yd-checklist-item v-for="vip in list" :val="vip.vipNum"
                                   style="border-bottom:1px solid #e9e6e6;"
                                   :disabled="vip.disabled">
                  <div class="list_item" style="border-bottom: none;">
                    <div class="img">
                      <img
                        v-if="vip.vipType==='积分卡'"
                        style="height: 100%;width: 100%"
                        src="@/assets/image/1-1.jpg"
                      />
                      <img
                        v-else-if="vip.vipType==='黄金卡'"
                        style="height: 100%;width: 100%"
                        src="@/assets/image/2-2.jpg"
                      />
                      <img
                        v-else
                        style="height: 100%;width: 100%"
                        src="@/assets/image/3-3.jpg"
                      />
                    </div>
                    <div class="list_item_content">
                      <p>{{vip.vipName}}</p>
                      <p>
                        <span>手机号：</span>
                        <span>{{vip.vipMobile}}</span>
                      </p>
                      <p>
                        <span>会员级别：</span>
                        <span>{{vip.vipType}}</span>
                      </p>
                    </div>
                  </div>
                </yd-checklist-item>
              </yd-checklist>
            </div>
          </template>
          <template v-else>
            <div class="noData">
              暂无数据
            </div>
          </template>
        </div>
      </van-list>
      <yd-backtop bottom="140px"></yd-backtop>
    </div>
  </main>
  <!--会员列表筛选-->
  <van-popup v-model="show" position="right" :style="{ height: '100%',width:'80%'}" @close="close">
    <div class="box">
      <van-cell style="background:#f4f4f4 ">筛选</van-cell>
      <div class="main">
        <van-cell>
          <input type="text" placeholder="请输入会员手机" class="input" v-model="vipMobile">
        </van-cell>
        <van-cell>
          会员等级：
        </van-cell>
        <van-cell>
          <yd-checklist v-model="selectCard"
                        class="checkbox"
                        :callback="cardChange"
                        color="#4F77AA">
            <yd-checklist-item :val="card.name" v-for="card in cardTypes" :key="card.value">
              <div>{{card.name}}</div>
            </yd-checklist-item>
          </yd-checklist>
        </van-cell>
        <van-cell>生日月份：</van-cell>
        <van-cell>
          <yd-checklist v-model="selectDate"
                        class="checkbox"
                        :callback="dateChange"
                        color="#4F77AA">
            <yd-checklist-item :val="month.name" v-for="(month,index) in monthList" :key="index" class="card_button">
              <div>{{month.name}}</div>
            </yd-checklist-item>
          </yd-checklist>
        </van-cell>
        <van-cell>入会日期：</van-cell>
        <van-cell>
          <div class="time">
            <span class="dateInput" @click="showPopup" style="display: inline-block;">{{nowDate||'选择日期'}}</span>
          </div>
        </van-cell>
      </div>
      <div class="bottom">
        <van-button size="small" id="reset" @click="reset">重置</van-button>
        <van-button type="info" size="small " @click="sure">确定</van-button>
      </div>
    </div>
  </van-popup>

  <!--会员列表-->
  <van-popup
    v-model="dateShow"
    position="bottom">
    <van-datetime-picker
      v-model="currentDate"
      type="year-month"
      :formatter="formatter"
      @cancel="cancel"
      @confirm="confirm"></van-datetime-picker>
  </van-popup>

  </body>
</template>

<script>
  import { vipList } from '@/api/vip/index';
  import { couponList, sendCoupon } from '@/api/coupon/index';

  export default {
    name: 'screenMember',
    data() {
      return {
        index: '',
        obj: '',
        status: 0,

        coupon: {},
        loading: false,
        finished: false,

        type: 1,
        pageNumber: 1,
        pageSize: 8,
        storeId: window.localStorage.getItem('storeNo'),

        list: [],//会员列表
        total: 0,
        //判断是不是筛选了条件
        screen: false,
        tabs_active: 0,

        // isCheckAll: false,
        selectMember: [],

        //会员列表筛选
        isCheckCard: false,//是否选中
        isCheckDate: false,//是否选中
        show: false,
        vipMobile: '',
        selectCard: [],
        cardTypes: [
          {
            value: 1,
            name: '铂金卡',
          },
          {
            value: 2,
            name: '黄金卡',
          },
          {
            value: 3,
            name: '积分卡',
          }],
        selectDate: [],
        monthList: [
          {
            value: 1,
            name: '01'
          },
          {
            value: 2,
            name: '02'
          },
          {
            value: 3,
            name: '03'
          },
          {
            value: 4,
            name: '04'
          },
          {
            value: 5,
            name: '05'
          },
          {
            value: 6,
            name: '06'
          },
          {
            value: 7,
            name: '07'
          },
          {
            value: 8,
            name: '08'
          },
          {
            value: 9,
            name: '09'
          },
          {
            value: 10,
            name: '10'
          },
          {
            value: 11,
            name: '11'
          },
          {
            value: 12,
            name: '12'
          }],
        nowDate: '',

        //时间选择
        dateShow: false,
        currentDate: new Date(),

        number: 20,//最多可选条数
        scroll: 0,
        distanceTop: 0,
        fixed: false,

        isFirstEender: false, // 是否第一次进入

        offsetTop: 0,

      };
    },
    created() {
      this.index = this.$route.query.index;
      this.status = this.$route.query.status;
      this.vipMobile = this.$route.query.vipMobile;
      this.getCouponList();
      if (this.status == '0') {
        this.getVipList();
      }
    },
    mounted() {
      this.offsetTop = document.getElementsByClassName('headerBox')[0].offsetHeight;
      const main = document.getElementById('#main');
      main.addEventListener('scroll', this.handleScroll);
    },
    beforeRouteEnter(to, from, next) {
      if (from.name == 'couponDetail') {
        to.meta.isBack = true;
      }
      next();
    },
    activated() {
      const main = document.getElementById('#main');
      if (this.scroll > 0) {
        main.scrollTo(0, this.scroll);
        this.scroll = 0;
        main.addEventListener('scroll', this.handleScroll());
      }
      if (!this.$route.meta.isBack || this.isFirstEender) {
        this.pageNumber = 1;
        this.reset();
      }
      this.$route.meta.isBack = false;
      this.isFirstEender = false;
    },
    methods: {
      handleScroll() {
        const main = document.getElementById('#main');
        this.scroll = main.scrollTop;
        this.fixed = this.scroll > this.distanceTop - 40;
      },
      getCouponList() {
        couponList({
          storeId: this.storeId,
          status: this.status,
          recordCode: '',
        })
          .then(({ data }) => {
            if (data.length === 0) return;
            this.coupon = data[this.index];
          });
      },
      getVipList() {
        vipList({
          type: this.type,
          vipMobile: this.vipMobile,
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          storeId: this.storeId,
          birthdaysMonthList: this.selectDate,
          vipTypeList: this.selectCard,
          inDate: this.nowDate,
        })
          .then(({ data }) => {
            this.list = data.list;
            this.total = data.totalCount;
            // if (this.vipMobile) this.selectMember.push(this.list[0].vipNum);
          });
      },
      fiterList() {
        this.show = true;
      },
      onLoad() {
        if (this.list.length < this.pageSize) {
          this.loading = false;
          this.finished = true;
        } else {
          const { list } = this;
          setTimeout(() => {
            this.pageNumber += 1;
            vipList({
              type: this.type,
              vipMobile: this.vipMobile,
              pageNumber: this.pageNumber,
              pageSize: this.pageSize,
              storeId: this.storeId,
              birthdaysMonthList: this.selectDate,
              vipTypeList: this.selectCard,
              inDate: this.nowDate,
            })
              .then(({ data }) => {
                this.loading = false;
                this.total = data.totalCount;
                this.list = list.concat(data.list);
                this.list.forEach(item => {
                  item.disabled = false;
                });
                if (this.selectMember.length >= this.number) {
                  this.list.forEach((item) => {
                    let res = this.contains(this.selectMember, item.vipMobile);
                    if (res) {
                      item.disabled = false;
                    } else {
                      item.disabled = true;
                    }
                  });
                }
                if (this.list.length >= data.totalCount) {
                  this.finished = true;
                }
              });
          }, 500);
        }
      },
      /**
       * Created by zyj on 2019-10-21
       * 会员列表筛选
       */
      cardChange(value, isCheck) {
        this.isCheckCard = isCheck;
        this.selectCard = value;
      },
      dateChange(value, isCheck) {
        this.isCheckDate = isCheck;
        this.selectDate = value;
      },
      showPopup() {
        this.dateShow = true;
      },
      formatter(type, value) {
        if (type === 'year') {
          return `${value}年`;
        }
        if (type === 'month') {
          return `${value}月`;
        }
        return value;
      },
      cancel() {
        this.dateShow = false;
      },
      confirm(value) {
        this.dateShow = false;
        this.nowDate = value.format('yyyy-MM');
      },
      reset() {
        this.nowDate = '';
        this.vipMobile = '';
        this.selectCard = [];
        this.selectDate = [];
        this.selectMember = [];
        this.getVipList();
      },
      sure() {
        this.pageNumber = 1;
        this.show = false;
        this.screen = true;
        this.selectMember = [];
        document.getElementById('#main').scrollTop = 0;
        this.getVipList();
      },
      close() {
        this.screen = false;
        if (this.vipMobile === '' && this.selectCard.length === 0 && this.selectDate.length === 0 && this.nowDate === '') return;
        this.sure();
      },
      listChange(val) {
        if (val.length >= this.number) {
          this.$toast({
            message: `一次性选择会员不能超过${this.number}个`,
            duration: 800,
          });
          this.list.forEach((item) => {
            let res = this.contains(this.selectMember, item.vipMobile);
            if (res) {
              item.disabled = false;
            } else {
              item.disabled = true;
            }
          });
        } else {
          // 触发试图更新
          this.list.forEach(item => {
            item.disabled = false;
          });
        }
      },
      //检查数组中是否包含特定的对象
      contains(a, id) {
        for (let i = 0; i < a.length; i++) {
          if (a[i] === id) {
            return true;
          }
        }
        return false;
      },
      //确定选择
      selectSure() {
        if (this.selectMember.length === 0) {
          this.$toast({
            message: '请选择会员',
            duration: 800,
          });
          return;
        }
        if (this.selectMember.length > this.number) {
          this.$toast({
            message: `一次性选择会员不能超过${this.number}个`,
            duration: 800,
          });
          return;
        }
        let arr = [];
        this.list.forEach((item) => {
          this.selectMember.forEach((a) => {
            if (item.vipNum == a) {
              arr.push(item);
            }
          });
        });
        this.$router.push({
          name: 'couponDetail',
          query: {
            status: this.status,
            index: this.index,
            list: JSON.stringify(arr),
          }
        });
      },
      faquan() {
        if (this.selectMember.length === 0) {
          this.$toast({
            message: '请选择会员',
            duration: 800,
          });
          return;
        }
        if (this.selectMember.length > this.number) {
          this.$toast({
            message: `一次性选择会员不能超过${this.number}个`,
            duration: 800,
          });
          return;
        }
        let arr = [];
        this.list.forEach((item) => {
          this.selectMember.forEach((a) => {
            if (item.vipNum == a) {
              let obj = {
                customerTel: item.vipMobile,
                vipCode: item.vipNum,
              };
              arr.push(obj);
            }
          });
        });
        sendCoupon({
          recordCode: this.coupon.recordCode,
          vipList: arr,
        })
          .then(({ msg }) => {
            this.$toast({
              message: `${msg}`,
              duration: 800,
            });
          });
      },
    }
  };
</script>

<style lang="scss">
  @import "@/assets/style/member-public.scss";
  @import "@/assets/style/work-public.scss";

  .van-cell {
    padding-top: vw(8);
    padding-bottom: vw(8);

    .van-cell__title {
      flex: 1
    }

    .van-cell__value {
      flex: 2;
    }
  }

  .yd-checklist-item:not(:last-child):after {
    border: 0.5px solid #e9e6e6
  }

  .yd-checklist-item {
    //border-bottom: 1px solid $border_color;
  }

  .all {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }

  .iconM {
    display: block;
    position: fixed;
    bottom: 10%;
    right: 10%;
    z-index: 1000;
    width: vw(60);
    height: vw(60);
    background-color: #4dbac0;
    color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.1);
    text-align: center;
    font-size: vw(35);
    line-height: vw(60);
  }

  .mm-content .go_or_down_list {
    margin-top: vw(0);
  }
</style>
