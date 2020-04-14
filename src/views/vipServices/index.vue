<template>
  <body>
  <div class="create">
    <div class="create_item">
      <span v-if="!stateIndex">生日月份</span>
      <span v-else>日期</span>
      <div class="input" @click="showYearMonthPopup">
        <span style="color:#909399" v-if="!stateIndex">{{birthday.split('-')[1]}}月</span>
        <span style="color:#909399" v-else>{{createDate}}</span>
        <van-icon name="arrow"></van-icon>
      </div>
    </div>
  </div>
  <NowStore @closePopup="closePopup"></NowStore>
  <MenuButton :typeList="stateList" @changeType="changeState"
              :typeIndex="stateIndex" class="stateList">
  </MenuButton>
  <div class="time_class" v-show="stateIndex===1">
    <TimeButton :timeList="timeList" :timeIndex="timeIndex" @changeTime="changeTime"></TimeButton>
  </div>
  <div class="table tableHead">
    <table border="0" cellspacing="0" cellpadding="0" rules="groups">
      <tbody>
      <tr>
        <td width="25%">店员</td>
        <td width="25%">应回访人数</td>
        <td width="25%">实回访人数</td>
        <td width="25%">未回访人数</td>
      </tr>
      </tbody>
    </table>
  </div>
  <main id="#main">
    <div class="mm-content">
      <div class="table">
        <table border="0" cellspacing="0" cellpadding="0" rules="groups">
          <tbody>
          <van-list
            :offset="10"
            v-model="loading"
            :finished="finished"
            finished-text=""
            @load="onLoad">
            <table border="0" cellspacing="0" cellpadding="0">
              <tbody>
              <tr v-for="(item,index) in list" :key="index" @click="toDetail(item.executorId)">
                <td width="25%" style="color: rgb(15, 144, 210);">{{item.executorName}}</td>
                <td width="25%">{{item.shouldReturn}}</td>
                <td width="25%">{{item.isReturn}}</td>
                <td width="25%">{{item.notReturn}}</td>
              </tr>
              </tbody>
            </table>
            <div class="noData" v-show="list.length===0">
              暂无数据
            </div>
          </van-list>
          </tbody>
        </table>
      </div>
    </div>
    <yd-backtop bottom="140px"></yd-backtop>
  </main>
  <!--筛选-->
  <van-popup v-model="show" position="right" :style="{ height: '100%',width:'80%'}" @close="close">
    <div class="box">
      <van-cell style="background:#f4f4f4 ">筛选</van-cell>
      <div class="main">
        <van-cell>
          店铺
        </van-cell>
        <van-radio-group v-model="radioStore">
          <van-cell v-for="(item,index) in storeList" :key="index">
            <van-radio :name="item.storeNo" checked-color="#4F77AA">{{item.storeName}}</van-radio>
          </van-cell>
        </van-radio-group>
      </div>
      <div class="bottom">
        <van-button size="small" id="reset" @click="reset">重置</van-button>
        <van-button type="info" size="small " @click="sure">确定</van-button>
      </div>
    </div>
  </van-popup>

  <!--任务年月-->
  <van-popup
    v-model="showYearMonth"
    position="bottom">
    <van-datetime-picker
      v-model="currentDate"
      :type="!stateIndex?'year-month':'date'"
      :formatter="formatter"
      @cancel="cancelYearMonth"
      @confirm="confirmYearMonth">
    </van-datetime-picker>
  </van-popup>
  </body>
</template>

<script>
import { dealerEmpReturn } from '@/api/visitReturn';
import TimeButton from '@/components/time-button.vue';
import MenuButton from '@/components/menu-button.vue';
import NowStore from '@/components/nowStore.vue';

export default {
  name: 'vipServices',
  components: {
    MenuButton,
    TimeButton,
    NowStore,
  },
  data() {
    return {
      stateList: [
        {
          value: 0,
          name: '会员生日',
        },
        {
          value: 1,
          name: '会员1730',
        },
      ],
      stateIndex: 0,
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
      list: [],
      pageNumber: 1,
      pageSize: 10,
      isLoading: false,
      loading: false,
      finished: false,
      status: 0, // 0生日 1次日 2七天 3三十天
      totalCount: 0,
      radioStore: 1,
      radioStoreName: '',
      storeList: [], // 店铺列表
      show: false,
      isFirstEender: false, // 是否第一次进入
      // yearMonth: new Date().format('yyyy-MM-dd'),
      showYearMonth: false,
      currentDate: new Date(),
      createDate: '', // 1730
      birthday: '', // 生日
    };
  },
  created() {
    this.birthday = new Date().format('yyyy-MM-dd');
    this.createDate = new Date().format('yyyy-MM-dd');
    this.radioStore = window.localStorage.getItem('storeNo');
    this.storeList = JSON.parse(window.localStorage.getItem('listStore'));
    this.setStoreName();
    this.getDealerEmpReturn();
    this.isFirstEender = true;
  },
  mounted() {
    const main = document.getElementById('#main');
    main.addEventListener('scroll', this.handleScroll);
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'vipServicesDetail') {
      to.meta.isBack = true;
    }
    next();
  },
  activated() {
    if (!this.$route.meta.isBack || this.isFirstEender) {
      this.pageNumber = 1;
      this.status = 0;
      this.stateIndex = 0;
      this.timeIndex = 1;
      this.loading = false;
      this.finished = false;
      this.setStoreName();
      this.getDealerEmpReturn();
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
    // 关闭弹框
    closePopup() {
      this.radioStore = window.localStorage.getItem('storeNo');
      this.setStoreName();
      this.getDealerEmpReturn();
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
      // this.yearMonth = !this.stateIndex ? `${value.format('yyyy-MM')}-01` : value.format('yyyy-MM-dd');
      if (!this.stateIndex) {
        this.birthday = `${value.format('yyyy-MM')}-01`;
      } else {
        this.createDate = value.format('yyyy-MM-dd');
      }
      this.showYearMonth = false;
      this.getDealerEmpReturn();
    },
    setStoreName() {
      this.storeList.forEach((item) => {
        if (item.storeNo === this.radioStore) {
          this.radioStoreName = item.storeName;
        }
      });
    },
    close() {
      this.sure();
    },
    reset() {
      // 重置店铺
      this.radioStore = JSON.parse(window.localStorage.getItem('listStore'))[0].storeNo;
      window.localStorage.setItem('storeNo', this.radioStore);
      this.setStoreName();
      this.getDealerEmpReturn();
    },
    sure() {
      this.setStoreName();
      this.show = false;
      window.localStorage.setItem('storeNo', this.radioStore);
      this.getDealerEmpReturn();
    },
    handleScroll() {
      const main = document.getElementById('#main');
      this.scroll = main.scrollTop;
      this.fixed = this.scroll > this.distanceTop - 40;
    },
    changeState(id) {
      // 防止重复加载
      if (this.stateIndex === id) return;
      this.stateIndex = id;
      this.pageNumber = 1;
      this.list = [];
      this.status = id;
      this.finished = false;
      this.loading = false;
      this.timeIndex = 1;
      this.currentDate = new Date();
      this.birthday = new Date().format('yyyy-MM-dd');
      this.createDate = new Date().format('yyyy-MM-dd');
      this.getDealerEmpReturn();
    },
    changeTime(id) {
      if (this.timeIndex == id) return;
      this.timeIndex = id;
      this.pageNumber = 1;
      this.status = id;
      const main = document.getElementById('#main');
      main.scrollTop = 0;
      this.finished = false;
      this.loading = false;
      this.getDealerEmpReturn();
    },
    getDealerEmpReturn() {
      dealerEmpReturn({
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        status: this.status,
        storeId: this.radioStore,
        birthday: this.birthday,
        createDate: this.createDate,
      })
        .then(({ data }) => {
          this.list = data.dealerEmpReturn;
          this.totalCount = data.totalCount;
        })
        .catch(() => {
          this.list = [];
          this.finished = false;
          this.loading = false;
        });
    },
    onLoad() {
      if (this.list.length < this.pageSize) {
        this.loading = false;
        this.finished = true;
      } else {
        const { list } = this;
        setTimeout(() => {
          this.pageNumber += 1;
          dealerEmpReturn({
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            status: this.status,
            storeId: this.radioStore,
            birthday: this.birthday,
            createDate: this.createDate,
          })
            .then((res) => {
              this.loading = false;
              this.total = res.data.totalCount;
              this.list = list.concat(res.data.dealerEmpReturn);
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
      }
    },
    fiter() {
      this.show = true;
    },
    toDetail(empId) {
      if (!this.stateIndex) {
        // 生日
        this.$router.push({
          name: 'vipServicesDetail',
          query: {
            empId,
            storeName: this.radioStoreName,
            yearMonth: this.birthday,
          },
        });
      } else {
        // 1730
        this.$router.push({
          name: 'vipServicesDetail',
          query: {
            empId,
            stateIndex: this.timeIndex,
            isOneSeven: true,
            storeName: this.radioStoreName,
            yearMonth: this.createDate,
          },
        });
      }
    },
  },
  watch: {
    '$route.path': function (newVal, oldVal) {
      if (newVal === '/Supervisor/vipServices/vipServicesDetail') return;
      if (oldVal === '/Supervisor/vipServices') {
        this.radioStore = JSON.parse(window.localStorage.getItem('listStore'))[0].storeNo;
        window.localStorage.setItem('storeNo', this.radioStore);
      }
    },
  },
};
</script>

<style lang="scss">
  @import "@/assets/style/member-public.scss";
  @import "@/assets/style/work-public.scss";

  /*.storeName {*/
  /*  width: vw(200);*/
  /*  overflow: hidden;*/
  /*  text-overflow: ellipsis;*/
  /*  white-space: nowrap;*/
  /*}*/
</style>
