<template>
  <body>
  <storePerson :names="names" name="person" @changeTab="changeTab" :noStore="noStore"></storePerson>
  <div class="cost_item_header">
    <van-tabs v-model="tabs_active" :line-height="2" color="#4F77AA" title-active-color="#4F77AA" @change="clickTab">
      <van-tab title="我的会员升级"></van-tab>
      <van-tab title="我的会员降级"></van-tab>
    </van-tabs>
  </div>
  <div class="time_class" v-show="tabs_active==1">
    <TimeButton :timeList="timeList" :timeIndex="timeIndex" @changeTime="changeTime"></TimeButton>
  </div>
  <div class="list_header">
    <div class="list_box">
      <span class="list_name" v-if="tabs_active==0">待升级会员列表</span>
      <span class="list_name" v-if="tabs_active==1">待降级会员列表</span>
      <span class="list_name">( {{total}}人 )</span>
      <van-button type="default" size="small" :class="[screen?'select screen':'select']" @click="fiterList">筛选
      </van-button>
    </div>
  </div>
  <main id="#main">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" :success-duration=500>
      <div class="mm-content">
        <van-list v-model="loading" :finished="finished" finished-text="" error-text="请求失败，点击重新加载"
                  @load="onLoad" :offset="10" :immediate-check="false">
          <div class="go_or_down_list">
            <template v-if="list.length !=0">
              <div class="list_main">
                <div class="list_item" v-for="(vip,index) in list" :key="index" @click="toDetail(vip.vipMobile)">
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
              </div>
            </template>
            <template v-else>
              <div class="noData">
                暂无数据
              </div>
            </template>
          </div>
        </van-list>
      </div>
    </van-pull-refresh>
    <yd-backtop bottom="140px"></yd-backtop>
  </main>

  <!--会员升级-->
  <van-popup v-model="show" position="right" :style="{ height: '100%',width:'80%'}" @close="close">
    <div class="box">
      <van-cell style="background-color: #f4f4f4">筛选</van-cell>
      <div class="main">
        <van-cell>
          <input type="text" placeholder="请输入手机号码" class="input" v-model="vipMobile">
        </van-cell>
        <van-cell>
          会员等级：
        </van-cell>
        <van-cell>
          <yd-checklist v-model="cardName"
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
          <yd-checklist v-model="monthNum"
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
  import TimeButton from '@/components/time-button.vue';
  import storePerson from '@/components/store-person.vue';
  import { vipUpAndDownList } from '@/api/vip';

  export default {
    name: 'memberUp_myMember',
    components: {
      storePerson,
      TimeButton
    },

    data() {
      return {
        names: {
          storeName: '店铺会员升/降级',
          personName: '我的会员升/降级',
        },
        pageSize: 5,
        pageNumber: 1,
        isLoading: false,
        timeList: [
          {
            name: '当日',
            value: 2
          },
          {
            name: '当周',
            value: 3
          },
          {
            name: '当月',
            value: 4
          }],
        timeIndex: 2,
        list: [],
        total: 0,//显示人数
        type: 1,//默认显示升级会员
        //筛选
        show: false,
        vipMobile: '',
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
        cardName: [],
        monthNum: [],
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
        dateShow: false,
        currentDate: new Date(),
        isCheck: false,
        //判断是不是筛选了条件
        screen: false,
        tabs_active: 0,
        isFirstEender: false, // 是否第一次进入

        nowShow: '',
        loading: false,
        finished: false,

        noStore: false,
      };
    },
    created() {
      this.noStore = JSON.parse(this.$route.query.noStore);
      this.getVipList();
      this.isFirstEender = true;
    },
    mounted() {
      let main = document.getElementById('#main');
      main.addEventListener('scroll', this.handleScroll);
    },
    beforeRouteEnter(to, from, next) {
      if (from.name == 'memberDetail') {
        to.meta.isBack = true;
      }
      next();
    },
    activated() {
      if (!this.$route.meta.isBack || this.isFirstEender) {
        this.pageNumber = 1;
        this.tabs_active = 0;
        this.reset();
      } else {
        let main = document.getElementById('#main');
        if (this.scroll > 0) {
          main.scrollTo(0, this.scroll);
          this.scroll = 0;
          main.addEventListener('scroll', this.handleScroll());
        }
      }
      this.$route.meta.isBack = false;
      this.isFirstEender = false;
      this.noStore = JSON.parse(this.$route.query.noStore);
    },
    methods: {
      formatter(type, value) {
        if (type === 'year') {
          return `${value}年`;
        }
        if (type === 'month') {
          return `${value}月`;
        }
        return value;
      },
      handleScroll() {
        let main = document.getElementById('#main');
        this.scroll = main.scrollTop;
      },
      changeTime(id) {
        if (this.timeIndex == id) return;
        this.timeIndex = id;
        this.type = this.timeIndex;
        this.pageNumber = 1;
        let main = document.getElementById('#main');
        main.scrollTop = 0;
        this.getVipList();
      },
      changeTab(name) {
        name === 'person' ? this.$router.push({ name: 'memberUp_myMember' }) : this.$router.push({ name: 'memberUp_storeMember' });
      },
      onRefresh() {
        this.pageNumber = 1;
        this.reset();
      },
      /**
       * Created by zyj on 2019-9-4
       * 筛选
       */
      fiterList() {
        this.show = true;
      },
      sure() {
        this.pageNumber = 1;
        document.getElementById('#main').scrollTop = 0;
        this.show = false;
        this.screen = true;
        this.getVipList();
      },
      close() {
        if (this.vipMobile == '' && this.cardName.length == 0 && this.monthNum.length == 0 && this.nowDate == '') {
          this.screen = false;
          return;
        }
        this.sure();
      },
      reset() {
        this.screen = false;
        this.cardName = [];
        this.monthNum = [];
        this.vipMobile = '';
        this.nowDate = '';
        this.getVipList();
      },
      //切换tab标签
      clickTab(value) {
        this.list = [];
        this.type = value + 1;
        this.timeIndex = 2;
        this.reset();
      },
      cardChange(value, isCheck) {
        this.cardName = value;
        this.isCheck = isCheck;
      },
      dateChange(value, isCheck) {
        this.monthNum = value;
        this.isCheck = isCheck;
      },
      //时间组件
      showPopup() {
        this.dateShow = true;
      },
      cancel() {
        this.dateShow = false;
      },
      confirm(value) {
        this.dateShow = false;
        this.nowDate = value.format('yyyy-MM');
      },
      onLoad() {
        if (this.list.length < this.pageSize) {
          this.loading = false;
          this.finished = true;
        } else {
          const { list } = this;
          setTimeout(() => {
            this.pageNumber += 1;
            vipUpAndDownList({
              type: 1,
              pageSize: this.pageSize,
              pageNumber: this.pageNumber,
              vipMobile: this.vipMobile,
              vipTypeList: this.cardName,
              birthdaysMonthList: this.monthNum,
              inDate: this.nowDate,
            })
              .then((res) => {
                this.loading = false;
                this.total = res.data.totalCount;
                this.list = list.concat(res.data.data);
                if (this.list.length >= res.data.totalCount) {
                  this.finished = true;
                  setTimeout(() => {
                    this.$toast({
                      message: '没有更多了',
                      duration: 800
                    });
                  }, 800);
                }
              });
          }, 500);
        }
      },
      getVipList() {
        this.pageNumber = 1;
        vipUpAndDownList({
          type: this.type,
          empId: window.localStorage.getItem('iposUserid'),
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
          vipMobile: this.vipMobile,
          vipTypeList: this.cardName,
          birthdaysMonthList: this.monthNum,
          inDate: this.nowDate,
        })
          .then((res) => {
            this.isLoading = false;
            this.finished = false;
            this.list = res.data.data;
            this.total = res.data.totalCount;
          })
          .catch(() => {
            this.isLoading = false;
            this.finished = false;
            this.list = [];
            this.total = 0;
          });
      },
      toDetail(vipMobile) {
        this.$router.push({
          name: 'memberDetail',
          query: {
            vipMobile,
            show: false
          },
        });
      },
    },
  };
</script>

<style lang="scss">
  @import "@/assets/style/member-public.scss";
</style>
