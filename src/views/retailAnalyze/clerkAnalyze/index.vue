<template>
  <body>
  <div class="time_header">
    <div class="time_box">
      <div @click="openTimePopup('start')">{{startDate}}</div>
      <span>--</span>
      <div @click="openTimePopup('end')">{{endDate}}</div>
    </div>

    <div class="timeRange">
      <!--      <i class="iconfont icon-riqi icon"></i>-->
      <span class="search" @click="search">查询</span>
    </div>
  </div>
  <NowStore @closePopup="closeStorePopup"></NowStore>

  <main id="main">
    <!--表头-->
    <div class="table tableHead" style="margin-top: 0">
      <table border="0" cellspacing="0" cellpadding="0" rules="groups">
        <tbody>
        <tr>
          <td width="17%">姓名</td>
          <td width="25%">销售金额</td>
          <td width="25%">招募人数</td>
          <td width="30%">储值卡售卡数</td>
        </tr>
        </tbody>
      </table>
    </div>

    <template v-if="list.length!==0">
      <div class="table">
        <table border="0" cellspacing="0" cellpadding="0" rules="groups">
          <tbody>
          <tr v-for="(item,index) in list" :key="index">
            <td width="17%" class="color_theme" @click="toDetail(item.empId,item.empName)">{{item.empName}}</td>
            <td width="25%">{{item.sales|formatAmount}}</td>
            <td width="25%">{{item.recruit|formatAmount}}</td>
            <td width="30%">{{item.card|formatAmount}}</td>
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

    <!-- 柱状图-->
    <div class="chart_box" v-show="lineLength !==0">
      <div id="myChart" :class="className" style="height: 100%;width:100%" ></div>
    </div>

    <div class="chart_nodata_box" v-show="lineLength ===0">
      <p class="_title">业绩贡献率</p>
      <p class="_noData"> 暂无数据</p>
    </div>
  </main>

  <!--  时间弹框-->
  <van-popup
    v-model="showTimePopup"
    position="bottom"
    close-on-popstate
    :close-on-click-overlay="false">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :formatter="formatter"
      :max-date="time"
      @cancel="showTimePopup=false"
      @confirm="confirm"
    />
  </van-popup>
  </body>
</template>

<script>
import NowStore from '@/components/nowStore.vue';
import { Dialog } from 'vant';
import { getThisMonth, formatNum } from '@/utils';
import { storeEmpAnalyze } from '@/api/retailAnalyze';

export default {
  name: 'clerkAnalyze',
  components: {
    NowStore,
  },
  data() {
    return {
      className: 'chart',
      list: [],
      lineData: '', // 柱状图数据
      lineLength: 0, // 柱状图长度
      startDate: '',
      endDate: '',
      currentDate: new Date(),
      time: new Date(), // 可以选择的最大日期
      showTimePopup: false, // 时间弹框
      timeFlag: '', // 开始时间/结束时间的标记
      isFirstEnter: false, // 是否第一次进入，默认false
      animation: true, // 折线图动画效果
    };
  },
  created() {
    this.isFirstEnter = true;
    this.startDate = getThisMonth(); // 当月1号
    this.endDate = new Date().format('yyyy-MM-dd');
    this.getInfo();
  },
  updated() {
    this.drawChart();
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == 'clerkAnalyzeDetail') {
      to.meta.isBack = true;
    }
    next();
  },
  activated() {
    // 如果不是返回 且  不是第一次进来
    if (!this.$route.meta.isBack && !this.isFirstEnter) {
      this.startDate = getThisMonth(); // 当月1号
      this.endDate = new Date().format('yyyy-MM-dd');
      this.getInfo();
    }
    this.$route.meta.isBack = false;
    this.isFirstEnter = false;
  },
  methods: {
    drawChart() {
      const myChart = this.$echarts.init(document.getElementById('myChart'));
      myChart.resize();
      myChart.clear();
      const option = {
        title: {
          text: '业绩贡献率',
          textStyle: {
            fontSize: 15,
          },
        },
        animation: this.animation,
        tooltip: {
          trigger: 'item',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line', // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: '{b}:\n{c}%',

        },
        legend: {
          data: ['姓名'],
          selectedMode: false, // 取消图例上的点击事件
          left: '40%',
        },

        grid: {
          left: '3%',
          right: '3%',
          bottom: '2%',
          top: '17%',
          containLabel: true,
          show: true,
          borderColor: '#fff',
        },
        xAxis: {
          type: 'category',
          data: this.lineData.xAxis,
          // data: ['刘成波', '庞清清', '王琦', '谢映苗', '卢小佩', '潘爱花', '潘爱花', '潘爱花', '潘爱花'],
          axisLabel: {
            fontSize: 13,
            interval: 0, // 强制显示所有标签
            rotate: 28,
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 10,
            formatter: '{value}%',
          },
          axisLine: {
            show: false,
          },

        },
        series: [
          {
            name: '姓名',
            type: 'bar',
            barWidth: '40%',
            data: this.lineData.yAxis,
            color: '#61a0a8',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter(p) {
                    return `${p.value}%`;
                  },
                  position: 'top',
                  textStyle: {
                    color: 'black',
                    fontSize: 13,
                  },
                },
              },
            },
          },

        ],
      };

      myChart.setOption(option);
    },
    getInfo() {
      storeEmpAnalyze({
        storeId: this.storeId,
        startDate: this.startDate,
        endDate: this.endDate,
      })
        .then(({ data }) => {
          this.list = data.storeEmpAnalyzeData;
          this.lineData = data.contributeData;
          // const isNull = value => value === 0;
          // console.log(this.lineData.yAxis.every(isNull));
          this.lineLength = data.contributeData.yAxis.length;
          this.animation = true;
          setTimeout(() => {
            this.animation = false;
          }, 1000);
        })
        .catch(() => {
          this.clearData();
        });
    },
    clearData() {
      const chart1 = this.$echarts.init(document.getElementById('myChart'));
      chart1.clear();
      this.lineLength = 0;
      this.list = [];
      this.lineData = '';
    },
    toDetail(empId, empName) {
      this.$router.push({
        name: 'clerkAnalyzeDetail',
        query: {
          storeId: window.localStorage.getItem('storeNo'),
          startDate: this.startDate,
          endDate: this.endDate,
          empId,
          empName,
        },
      });
    },
    // 格式化时间
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
    openTimePopup(value) {
      this.showTimePopup = true;
      this.timeFlag = value;
      this.currentDate = this.changeToGMT(); // 格式化为格林尼治时间
    },
    // 转换为格林尼治时间
    changeToGMT() {
      let GMT = '';
      if (this.timeFlag === 'start') {
        GMT = new Date(this.startDate);
      } else {
        GMT = new Date(this.endDate);
      }
      return GMT;
    },
    confirm(value) {
      this.showTimePopup = false;
      if (this.timeFlag === 'start') {
        this.startDate = value.format('yyyy-MM-dd');
      } else {
        this.endDate = value.format('yyyy-MM-dd');
      }
    },
    // 获取月份
    splitTime(time) {
      const month = time.split('-')[1];
      return parseInt(month);
    },
    search() {
      if (this.splitTime(this.startDate) !== this.splitTime(this.endDate)) {
        Dialog.alert({
          message: '不能跨月查询,请重新选择月份!',
        }).then(() => {

        });
        return;
      }
      if (this.startDate > this.endDate) {
        Dialog.alert({
          message: '开始日期不能大于结束日期!',
        }).then(() => {

        });
        return;
      }
      this.getInfo();
    },
    closeStorePopup() {
      this.getInfo();
    },
  },
};
</script>

<style scoped lang="scss">
  @import "@/assets/style/retailAnalyze.scss";
</style>
