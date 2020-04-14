<template>
  <body>
  <div class="timeBox">
    <div class="time">
      <span @click="showPopup" class="time-select">{{nowDate}}</span>
      <van-icon name="arrow-down" v-show="!show"></van-icon>
      <van-icon name="arrow-up" v-show="show"></van-icon>

      <van-popup
        v-model="show"
        position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          :formatter="formatter"
          @cancel="cancel"
          @confirm="confirm"></van-datetime-picker>
      </van-popup>
    </div>
    <TimeButton :timeIndex="timeIndex" :timeList="timeList" @changeTime="changeTime"></TimeButton>
  </div>
  <div class="table tableHead">
    <table border="0" cellspacing="0" cellpadding="0" rules="groups">
      <thead>
      <tr>
        <td width="25%">时间</td>
        <td width="16.7%">销售金额</td>
        <td width="16.7%">数量</td>
        <td width="16.7%">折扣</td>
        <td width="25%">会员销售比</td>
      </tr>
      </thead>
    </table>
  </div>

  <main>
    <div class="mm-content">
      <template v-if="listData.length!==0">
        <div class="table">
          <table border="0" cellspacing="0" cellpadding="0" rules="groups">
            <tbody>
            <tr v-for="item in listData" :key="item.rowNumber">
              <td width="25%">{{item.dateKey | replaceDate }}</td>
              <td width="16.7%">{{item.sAmount | NumFormat}}</td>
              <td width="16.7%">{{item.sOrderQty}}</td>
              <td width="16.7%">{{item.discount | numFilter}}%</td>
              <td width="25%">{{item.vipSalesPercentage | numFilter}}%</td>
            </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-else>
        <div class="noData">
          暂无数据
        </div>
      </template>
    </div>

  </main>
  </body>
</template>

<script>
  import TimeButton from '../../../../components/time-button.vue';
  import { ListData } from '@/api/sales';

  export default {
    name: 'storePerformanceDetail',
    components: {
      TimeButton
    },
    data() {
      return {
        tabindex: 1,
        timeList: [
          {
            value: 1,
            name: '日',
          },
          {
            value: 2,
            name: '周',
          },
          {
            value: 3,
            name: '月',
          }],
        timeIndex: '',
        listData: [],
        currPage: 1,
        pageSize: 30,
        status: '',
        currentDate: new Date(),
        nowDate: '', // 用来展示当前年月
        date: '', // 用来传参
        show: false,
        isLoading: false,
      };
    },
    created() {
      this.status = this.$route.query.status - 1;
      if (this.status === 1 || this.status === 2) {
        this.nowDate = new Date().format('yyyy-MM-dd');
      } else {
        this.nowDate = this.yesterday();
      }
      this.date = this.nowDate;
      this.timeIndex = this.status + 1;
      this.getListData();
    },
    methods: {
      yesterday() {
        const timenow = new Date();
        timenow.setDate(timenow.getDate() - 1); // 设置天数 -1 天，昨天的日期
        const y = timenow.getFullYear();// 年
        let m = timenow.getMonth() + 1;// 月
        m = m < 10 ? `0${m}` : m;
        let d = timenow.getDate();// 日
        d = d < 10 ? (`0${d}`) : d;
        const yesterdayTime = `${y}-${m}-${d}`;// 字符串拼接成自己想要的时间格式，现在是yyyy/mm/dd格式
        return yesterdayTime;
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
      changeTime(id) {
        if (this.timeIndex === id) return;
        this.timeIndex = id;
        this.status = this.timeIndex - 1;
        if (this.status === 1 || this.status === 2) {
          this.nowDate = new Date().format('yyyy-MM-dd');
        } else {
          this.nowDate = this.yesterday();
        }
        this.date = this.nowDate;
        this.getListData();
      },
      showPopup() {
        this.show = true;
      },
      confirm(value) {
        this.show = false;
        this.nowDate = value.format('yyyy-MM-dd');
        this.date = value.format('yyyy-MM-dd');
        this.getListData();
      },
      cancel() {
        this.show = false;
      },
      getListData() {
        ListData({
          status: this.status,
          pageSize: this.pageSize,
          currPage: this.currPage,
          date: this.date,
        })
          .then(({ data }) => {
            if (data.length !== 0) {
              this.listData = data;
              this.isLoading = false;
            } else {
              this.$toast({
                message: '哦偶，没卖出任何东西',
                duration:800,
              });
              this.isLoading = false;
              // 恢复0数值
              this.listData = [];
            }
          })
          .catch(() => {
            this.listData = [];
            this.isLoading = false;
          });
      },
      // 下拉刷新
      onRefresh() {
        setTimeout(() => {
          this.getListData();
        }, 500);
      },
    },
  };
</script>

<style scoped lang="scss">
  /*不滚动内容*/
  .tableHead {
    padding: 0 vw(10);
    font-size: vw(14);
    background: #fff;
    margin-top: vw(8);
    height: vw(30);
    line-height: vw(30);
    color: $gray_color;
    border-bottom: 1px solid $tableBorder;
  }

  /*类别按钮*/
  .timeBox {
    padding: vw(8);
    /*height: vw(80);*/
    margin-top: vw(8);
    background: #fff;

    .time {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 0 vw(10) 0;
      font-size: vw(14);

      .time-select {
        display: block;
      }
    }
  }


  /*滚动区域*/
  .mm-content {
    background-color: #fff;

    .table {
      padding: 0 vw(10);
    }
  }

  .table {
    font-size: vw(14);
    height: auto;
    background: #fff;

    table {
      width: 100%;

      td {
        border-bottom: 1px solid $tableBorder;
        text-align: center;
        height: vw(30);
        line-height: vw(30);
        text-overflow: ellipsis;
        vertical-align: middle;
      }
    }
  }

</style>
