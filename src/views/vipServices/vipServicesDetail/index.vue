<template>
  <body>
  <main id="#main">
    <div class="create">
      <div class="create_item">
        <span>当前店铺</span>
        <div class="input">
          <span style="color:#4F77AA;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">{{storeName}}</span>
        </div>
      </div>
      <div class="create_item">
        <span v-if="!isOneSeven">生日月份</span>
        <span v-else>日期</span>
        <div class="input" @click="showYearMonthPopup">
          <span style="color:#909399" v-if="!isOneSeven">{{yearMonth.split('-')[1]}}月</span>
          <span style="color:#909399" v-else>{{yearMonth}}</span>
          <van-icon name="arrow"></van-icon>
        </div>
      </div>
      <div class="grade">
        <span>会员等级</span>
        <div class="input">
        <van-button
              v-for="(item,index) in checkboxList"
              :key="index"
              :class="checkbox.includes(item)?'active button':'button'"
              @click="check(item)"
              size="small"
              :icon="checkbox.includes(item)?'success':''"
        >{{item}}</van-button>
        </div>
      </div>
    </div>
    <!--<div class="time_class" v-show="isOneSeven">-->
    <!--<TimeButton :timeList="timeList" :timeIndex="timeIndex" @changeTime="changeTime"></TimeButton>-->
    <!--</div>-->
    <van-sticky :offset-top="offsetTop">
      <div class="list_header">
        <div class="list_box">
          <span class="list_name" v-if="!isOneSeven">我的会员生日</span>
          <span class="list_name" v-if="isOneSeven&&status===1">次日感谢</span>
          <span class="list_name" v-if="isOneSeven&&status===2">7天使用反馈情况</span>
          <span class="list_name" v-if="isOneSeven&&status===3">30天保养通知</span>
          <span class="list_name">( {{total}}人 )</span>
          <!--<span class="reset" @click="resetBirthday">重置日期</span>-->
          <div class="paixu" @click="handlePaixu" style="right: 10px;">
            <span>排序</span>
            <div>
              <van-icon name="arrow-up" :class="!sort?'paixuActive':''"></van-icon>
              <van-icon name="arrow-down" :class="sort?'paixuActive':''"></van-icon>
            </div>
          </div>
        </div>
      </div>
    </van-sticky>

    <!--<van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" :success-duration=500>-->
    <div class="mm-content">
      <van-list v-model="loading" :finished="finished" finished-text="" error-text="请求失败，点击重新加载"
                @load="onLoad" :offset="10" :immediate-check="false">
        <div class="go_or_down_list">
          <template v-if="list.length !==0">
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
    <!--</van-pull-refresh>-->
    <yd-backtop bottom="140px"></yd-backtop>
  </main>
  <!--任务年月-->
  <van-popup
    v-model="showYearMonth"
    position="bottom">
    <van-datetime-picker
      v-model="currentDate"
      :type="!isOneSeven?'year-month':'date'"
      :formatter="formatter"
      @cancel="cancelYearMonth"
      @confirm="confirmYearMonth">
    </van-datetime-picker>
  </van-popup>
  </body>
</template>

<script>
import { vipBirthdaysReturnRecord, memberBirthDay } from '@/api/vip';
import { remindReturnRecord } from '@/api/sales';
import TimeButton from '@/components/time-button.vue';

export default {
  name: 'vipServicesDetail',
  components: {
    TimeButton,
  },
  data() {
    return {
      offsetTop: 0,
      timeList: [
        {
          name: '次日感谢',
          value: 1,
        },
        {
          name: '7天使用反馈情况',
          value: 2,
        },
        {
          name: '30天保养通知',
          value: 3,
        }],
      timeIndex: 1,
      pageSize: 6,
      pageNumber: 1,
      // 任务年月
      currentDate: new Date(),
      showYearMonth: false,
      yearMonth: '',
      checkboxList: ['积分卡', '黄金卡', '铂金卡'],
      checkbox: ['积分卡', '黄金卡', '铂金卡'], // 选中的数组
      total: 0,
      // 会员列表
      isLoading: false,
      loading: false,
      finished: false,
      list: [],
      empId: '',
      option: [
        {
          text: '已回访',
          value: 0,
        },
        {
          text: '未回访',
          value: 1,
        },
      ],
      value: 0,
      sort: false, // 排序
      sortNumber: 0,
      vipNum: '', // 会员卡号
      isFirstEender: false,
      isOneSeven: false, // 判断是否是1730点进来的
      status: 0,
      storeName: '', // 店铺名字
    };
  },
  created() {
    if (this.$route.query.storeName) this.storeName = this.$route.query.storeName;
    if (this.$route.query.stateIndex) this.status = JSON.parse(this.$route.query.stateIndex);
    this.currentDate = new Date();
    this.empId = this.$route.query.empId;
    this.yearMonth = this.$route.query.yearMonth;
    if (this.$route.query.isOneSeven) this.isOneSeven = JSON.parse(this.$route.query.isOneSeven);
    if (!this.isOneSeven) {
      // 生日
      this.getVipBirthdaysReturnRecord();
    } else {
      // 1730
      this.getRemindReturnRecord();
    }
    this.isFirstEender = true;
  },
  mounted() {
    this.offsetTop = document.getElementsByClassName('list_header')[0].offsetHeight - 15;
    const main = document.getElementById('#main');
    main.addEventListener('scroll', this.handleScroll);
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'visitRecord') {
      to.meta.isBack = true;
    }
    if (from.name === 'memberDetail') {
      to.meta.isBack = true;
    }
    next();
  },
  activated() {
    if (!this.$route.meta.isBack || this.isFirstEender) {
      this.pageNumber = 1;
      this.isOneSeven = false;
      this.list = [];
      this.total = 0;
      this.sortNumber = 0;
      this.sort = false;
      this.checkbox = ['积分卡', '黄金卡', '铂金卡'];// 选中的数组
      if (this.$route.query.storeName) this.storeName = this.$route.query.storeName;
      if (this.$route.query.stateIndex) this.status = JSON.parse(this.$route.query.stateIndex);
      this.currentDate = new Date();
      this.empId = this.$route.query.empId;
      this.yearMonth = this.$route.query.yearMonth;
      if (this.$route.query.isOneSeven) this.isOneSeven = JSON.parse(this.$route.query.isOneSeven);
      if (!this.isOneSeven) {
        // 生日
        this.getVipBirthdaysReturnRecord();
      } else {
        // 1730
        this.getRemindReturnRecord();
      }
    } else {
      const main = document.getElementById('#main');
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
    // resetBirthday() {
    //   if (this.yearMonth === '') return;
    //   this.yearMonth = '';
    //   this.currentDate = new Date();
    //   if (!this.isOneSeven) {
    //     //生日
    //     this.getVipBirthdaysReturnRecord();
    //   } else {
    //     //1730
    //     this.getRemindReturnRecord();
    //   }
    // },
    handleScroll() {
      const main = document.getElementById('#main');
      this.scroll = main.scrollTop;
    },
    handlePaixu() {
      this.pageNumber = 1;
      this.sort = !this.sort;
      this.sortNumber = this.sort ? 1 : 0;
      const main = document.getElementById('#main');
      main.scrollTop = 0;// 返回顶部
      if (!this.isOneSeven) {
        // 生日
        this.getVipBirthdaysReturnRecord();
      } else {
        // 1730
        this.getRemindReturnRecord();
      }
    },
    // 获取会员生日列表
    getVipBirthdaysReturnRecord() {
      vipBirthdaysReturnRecord({
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        empId: this.empId,
        vipNum: this.vipNum,
        birthday: this.yearMonth,
        vipTypeList: this.checkbox,
        sort: this.sortNumber, // 0已回访排前面，1未回访排前面
      })
        .then(({ data }) => {
          this.total = data.totalCount;
          this.list = data.returnRecord;// 记录列表
        });
    },
    // 获取1730会员列表
    getRemindReturnRecord() {
      remindReturnRecord({
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        vipNum: this.vipNum,
        status: this.status - 1, // 0次日 1七天 2三十天
        empId: this.empId,
        vipTypeList: this.checkbox,
        createDate: this.yearMonth,
        sort: this.sortNumber, // 0已回访排前面，1未回访排前面
        type: this.status,
      })
        .then(({ data }) => {
          this.total = data.totalCount;
          this.list = data.returnRecord;// 记录列表
        });
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
    // 任务年月
    showYearMonthPopup() {
      this.showYearMonth = true;
    },
    cancelYearMonth() {
      this.showYearMonth = false;
    },
    confirmYearMonth(value) {
      this.pageNumber = 1;
      this.finished = false;
      this.loading = false;
      this.yearMonth = !this.isOneSeven ? `${value.format('yyyy-MM')}-01` : value.format('yyyy-MM-dd');
      this.showYearMonth = false;
      if (!this.isOneSeven) {
        // 生日
        this.getVipBirthdaysReturnRecord();
      } else {
        // 1730
        this.getRemindReturnRecord();
      }
    },
    // 多选
    check(item) {
      const idx = this.checkbox.indexOf(item);
      // 如果已经选中了，那就取消选中，如果没有，则选中
      if (idx > -1) {
        this.checkbox.splice(idx, 1);
      } else {
        this.checkbox.push(item);
      }
      if (!this.isOneSeven) {
        // 生日
        this.getVipBirthdaysReturnRecord();
      } else {
        // 1730
        this.getRemindReturnRecord();
      }
    },
    onLoad() {
      if (this.list.length < this.pageSize) {
        this.loading = false;
        this.finished = true;
      } else {
        const { list } = this;
        if (!this.isOneSeven) {
          setTimeout(() => {
            this.pageNumber += 1;
            vipBirthdaysReturnRecord({
              pageSize: this.pageSize,
              pageNumber: this.pageNumber,
              empId: this.empId,
              vipNum: this.vipNum,
              birthday: this.yearMonth,
              vipTypeList: this.checkbox,
              sort: this.sortNumber, // 0已回访排前面，1未回访排前面
            })
              .then((res) => {
                this.loading = false;
                this.list = list.concat(res.data.returnRecord);
                this.totalCount = res.data.totalCount;
                if (this.list.length >= res.data.totalCount) {
                  this.finished = true;
                  setTimeout(() => {
                    this.$toast({
                      message: '没有更多了',
                      duration: 800,
                    });
                  }, 800);
                }
              });
          }, 500);
        } else {
          this.pageNumber += 1;
          remindReturnRecord({
            pageSize: this.pageSize,
            pageNumber: this.pageNumber,
            vipNum: this.vipNum,
            status: this.status,
            empId: this.empId,
            vipTypeList: this.checkbox,
            createDate: this.yearMonth,
            sort: this.sortNumber, // 0已回访排前面，1未回访排前面
            type: this.status,
          })
            .then((res) => {
              this.loading = false;
              this.list = list.concat(res.data.returnRecord);
              this.totalCount = res.data.totalCount;
              if (this.list.length >= res.data.totalCount) {
                this.finished = true;
                setTimeout(() => {
                  this.$toast({
                    message: '没有更多了',
                    duration: 800,
                  });
                }, 800);
              }
            });
        }
      }
    },
    toDetail(vipMobile) {
      this.$router.push({
        name: 'memberDetail',
        query: {
          vipMobile,
          show: false,
        },
      });
    },
    toVisitRecord(vipNum) {
      if (!this.isOneSeven) {
        // 生日
        this.$router.push({
          name: 'visitRecord',
          query: {
            flag: true, // 经销商只读,
            vipNum,
            status: 98,
            yearMonth: this.yearMonth.split('-')[0] + this.yearMonth.split('-')[1],
            // vip: JSON.stringify(vip)
          },
        });
      } else {
        // 1730
        this.$router.push({
          name: 'visitRecord',
          query: {
            // isOneSeven: true,
            status: this.status - 1,
            flag: true, // 经销商只读,
            vipNum,
            // vip: JSON.stringify(vip),
            isOneSeven: true,
            createDate: this.yearMonth,
          },
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
  @import "@/assets/style/member-public.scss";
  @import "@/assets/style/work-public.scss";

  .button {
    /*padding: vw(4) vw(8);*/
    background-color: #F7F8FA;
    border: 1px solid #F7F8FA;
    margin-right: vw(10);
    border-radius: vw(5);
    width: 80px;
  }

  .active {
    border: 1px solid $theme-color;
    background-color: #fff;
    color: $theme-color;
  }

  .list_box {
    position: relative;

    .paixu {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      display: flex;
      align-items: center;

      div {
        display: flex;
        flex-direction: column;

        i {
          font-size: vw(12);
          color: #ccc;
        }

        i:first-of-type {
          margin-bottom: vw(-2);
        }

        i:last-of-type {
          margin-top: vw(-2);
        }

        .paixuActive {
          color: $theme-color;
          font-weight: 700;
        }
      }
    }

    .reset {
      position: absolute;
      top: 50%;
      right: vw(70);
      transform: translateY(-50%);
      color: $theme-color;
    }
  }

</style>
