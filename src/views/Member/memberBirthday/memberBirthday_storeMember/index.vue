<template>
  <body>
  <storePerson :names="names" name="store" @changeTab="changeTab"></storePerson>

  <div class="time_class">
    <TimeButton :timeList="timeList" :timeIndex="timeIndex" @changeTime="changeTime"></TimeButton>
  </div>
  <div class="list_header">
    <div class="list_box">
      <span class="list_name">会员生日列表</span>
      <span class="list_name">( {{totalCount}}人 )</span>
      <div class="paixu" @click="handlePaixu" style="right: 80px;">
        <span>排序</span>
        <div>
          <van-icon name="arrow-up" :class="!sort?'paixuActive':''"></van-icon>
          <van-icon name="arrow-down" :class="sort?'paixuActive':''"></van-icon>
        </div>
      </div>
      <van-button type="default" size="small" :class="[screen?'select screen':'select']" @click="fiter">筛选
      </van-button>
    </div>
  </div>
  <main id="#main">
    <!--当日会员生日列表-->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" :success-duration=500>
      <div class="mm-content">
        <van-list v-model="loading" :finished="finished" finished-text="" error-text="请求失败，点击重新加载"
                  @load="onLoad" :offset="10" :immediate-check="false">
          <div class="go_or_down_list">
            <template v-if="list.length!=0">
              <div class="list_main">
                <div class="list_item" v-for="(vip,index) in list" :key="index" @click="toDetail(vip.vipMobile)">
                  <van-button v-if="!vip.isReturn" plain color="#4F77AA" size="mini" class="listButton"
                              @click.stop="toVisitRecord(vip.vipNum)">未回访
                  </van-button>
                  <van-button v-else plain color="#04be02" size="mini" class="listButton"
                              @click.stop="toVisitRecord(vip.vipNum)">已回访
                  </van-button>
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

  <!--筛选-->
  <van-popup v-model="show" position="right" :style="{ height: '100%',width:'80%'}" @close="close">
    <div class="box">
      <van-cell style="background:#f4f4f4 ">筛选</van-cell>
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
        <!--<van-cell>生日月份：</van-cell>-->
        <!--<van-cell>-->
        <!--<yd-checklist v-model="monthNum"-->
        <!--class="checkbox"-->
        <!--:callback="dateChange"-->
        <!--color="#4F77AA">-->
        <!--<yd-checklist-item :val="month.name" v-for="(month,index) in monthList" :key="index" class="card_button">-->
        <!--<div>{{month.name}}</div>-->
        <!--</yd-checklist-item>-->
        <!--</yd-checklist>-->
        <!--</van-cell>-->
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
  import { memberBirthDay } from '@/api/vip';
  import storePerson from '@/components/store-person.vue';
  import TimeButton from '@/components/time-button.vue';

  export default {
    name: 'memberBirthday_storeMember',
    components: {
      TimeButton,
      storePerson,
    },
    data() {
      return {
        names: {
          storeName: '店铺会员生日',
          personName: '我的会员生日',
        },
        timeList: [
          {
            name: '当日',
            value: 0
          },
          {
            name: '当周',
            value: 1
          },
          {
            name: '当月',
            value: 2
          }],
        timeIndex: 0,

        pageSize: 6,
        pageNumber: 1,

        cardIndex: 0,
        list: [],
        showMore: true,

        totalCount: 0,

        isLoading: false,
        finished: false,
        loading: false,

        scroll: '',

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

        screen: false,
        isFirstEender: false, // 是否第一次进入

        sort: false,//排序
        sortNumber: 0,//0已回访 1未回访
      };
    },
    created() {
      if (JSON.stringify(this.$route.query.timeIndex)) {
        this.timeIndex = parseInt(this.$route.query.timeIndex);
      }
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
        if (JSON.stringify(this.$route.query.timeIndex)) {
          this.timeIndex = parseInt(this.$route.query.timeIndex);
        }
        this.sortNumber = 0;//已回访
        this.sort = false;
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
    },
    methods: {
      handlePaixu() {
        this.sort = !this.sort;
        this.sortNumber = this.sort ? 1 : 0;
        this.getVipList();
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
      handleScroll() {
        let main = document.getElementById('#main');
        this.scroll = main.scrollTop;
      },
      changeTab(name) {
        name === 'person' ? this.$router.push({
          name: 'memberBirthday_myMember',
          query: {
            noStore: false,
            timeIndex: 0,
          }
        }) : this.$router.push({
          name: 'memberBirthday_storeMember',
          query: { timeIndex: 0 }
        });
      },
      changeTime(id) {
        if (this.timeIndex == id) return;
        this.timeIndex = id;
        this.pageNumber = 1;
        this.sortNumber = 0;//已回访
        this.sort = false;
        let main = document.getElementById('#main');
        main.scrollTop = 0;
        const { path } = this.$router.history.current;
        this.$router.replace({
          path,
          query: {
            timeIndex: this.timeIndex
          },
        });
        this.reset();
      },
      getVipList() {
        memberBirthDay({
          status: this.timeIndex,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
          vipMobile: this.vipMobile,
          vipTypeList: this.cardName,
          birthdaysMonthList: this.monthNum,
          inDate: this.nowDate,
          sort: this.sortNumber,
        })
          .then((res) => {
            this.totalCount = res.data.totalCount;
            this.list = res.data.list;
            this.isLoading = false;
            this.finished = false;
          })
          .catch(() => {
            this.totalCount = 0;
            this.list = [];
            this.isLoading = false;
            this.finished = false;
          });
      },

      cardChange(value, isCheck) {
        this.cardName = value;
        this.isCheck = isCheck;
      },
      dateChange(value, isCheck) {
        this.monthNum = value;
        this.isCheck = isCheck;
      },

      fiter() {
        this.show = true;
      },
      selectType(card) {
        this.cardName = card.name;
        this.cardIndex = card.value;
      },
      reset() {
        this.screen = false;
        this.cardName = [];
        this.monthNum = [];
        this.vipMobile = '';
        this.nowDate = '';
        this.getVipList();
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
      toDetail(vipMobile) {
        this.$router.push({
          name: 'memberDetail',
          query: {
            vipMobile,
            show: false
          },
        });
      },
      onRefresh() {
        this.pageNumber = 1;
        this.reset();
      },
      onLoad() {
        if (this.list.length < this.pageSize) {
          this.loading = false;
          this.finished = true;
        } else {
          const { list } = this;
          setTimeout(() => {
            this.pageNumber += 1;
            memberBirthDay({
              status: this.timeIndex,
              pageSize: this.pageSize,
              pageNumber: this.pageNumber,
              vipMobile: this.vipMobile,
              vipTypeList: this.cardName,
              birthdaysMonthList: this.monthNum,
              inDate: this.nowDate,
              sort: this.sortNumber,
            })
              .then((res) => {
                this.loading = false;
                this.totalCount = res.data.totalCount;
                this.list = list.concat(res.data.list);
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
      toVisitRecord(vipNum) {
        this.$router.push({
          name: 'visitRecord',
          query: {
            vipNum,
            status: 98,
            flag: true
          }
        });
      },
    },
  };
</script>

<style lang="scss">
  @import '@/assets/style/member-public.scss';

  .mm-content {
    .totalBox {
      height: vw(70);
      background: #fff;
      margin-top: vw(8);
      display: flex;

      span {
        flex-grow: 1;
        margin: auto 0;
      }
    }
  }

</style>
