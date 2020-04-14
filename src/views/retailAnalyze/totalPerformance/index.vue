<template>
  <body>
  <div class="time_header">
    <div class="time_box">
      <div @click="openTimePopup('start')">{{startDate}}</div>
      <span>--</span>
      <div @click="openTimePopup('end')">{{endDate}}</div>
    </div>

    <div class="timeRange" @click="search">
<!--      <i class="iconfont icon-riqi icon"></i>-->
      <span class="search">查询</span>
    </div>
  </div>
  <NowStore @closePopup="closeStorePopup"></NowStore>

  <main id="main" >
     <div class="content_table_box bb">
       <!-- 销售金额-->
        <div class="content_table_item br">
           <div class="table_title">
             <i class="iconfont icon-danjia icon"></i>
             <span >销售金额</span>
           </div>
          <p @click="toDetail">
            <span class="number_fontSize color_theme underline" style="padding-left: 0">{{salesAnalyzeData.sumAmount|formatAmount}} </span>
            <i class="color_theme">元</i></p>
        </div>
         <!-- 上期金额-->
       <div class="content_table_item br">
         <div class="table_title">
           <i class="iconfont icon-danjia icon"></i>
           <span >上期金额</span>
           <div style="font-size: 12px;">{{formatLastTime}}</div>
         </div>
         <p class="number_fontSize color_theme">{{salesAnalyzeData.lastSumAmount|formatAmount}} <i>元</i></p>
       </div>
       <!--环比上升-->
       <div class="content_table_item">
         <div class="table_title">
           <i class="iconfont icon-icon-ayear icon"></i>
           <span >环比</span>
         </div>
         <p class="number_fontSize color_theme">{{salesAnalyzeData.chainAmount |formatPercent}} <i>%</i>
         </p>
       </div>
     </div>

    <div class="content_table_box bb">
      <!-- 销售数量-->
      <div class="content_table_item br">
        <div class="table_title">
          <i class="iconfont icon-shuliang1 icon "></i>
          <span class="">销售数量</span>
        </div>
        <p class="number_fontSize color_red">{{salesAnalyzeData.sumNum|formatAmount}} <i class="color_red">个</i></p>
      </div>
      <!-- 上期数量-->
      <div class="content_table_item br">
        <div class="table_title">
          <i class="iconfont icon-shuliang1 icon"></i>
          <span >上期数量</span>
          <div style="font-size: 12px;">{{formatLastTime}}</div>
        </div>

        <p class="number_fontSize color_red">{{salesAnalyzeData.lastSumNum|formatAmount}} <i>个</i></p>
      </div>
      <!--环比上升-->
      <div class="content_table_item">
        <div class="table_title">
          <i class="iconfont icon-icon-ayear icon"></i>
          <span >环比</span>
        </div>
        <p class="number_fontSize color_red">{{salesAnalyzeData.chainNum |formatPercent}} <i>%</i>
        </p>
      </div>
    </div>

    <div class="content_table_box bb">
      <!-- 金额指标-->
      <div class="content_table_item br">
        <div class="table_title">
          <i class="iconfont icon-baobiaotongji icon"></i>
          <span class="color_orange">金额指标</span>
        </div>
        <p class="number_fontSize color_orange">{{salesAnalyzeData.salesTarget|formatAmount}} <i>元</i></p>
      </div>
      <!-- 剩余指标-->
      <div class="content_table_item br">
        <div class="table_title">
          <i class="iconfont icon-baobiaotongji icon"></i>
          <span class="color_orange">剩余指标</span>
        </div>
        <p class="number_fontSize color_orange">{{salesAnalyzeData.targetSurplus|formatAmount}} <i>元</i></p>
      </div>
      <!--折扣-->
      <div class="content_table_item">
        <div class="table_title">
          <i class="iconfont icon-zhekou icon"></i>
          <span class="color_orange">平均折扣</span>
        </div>
        <p class="number_fontSize color_orange">{{salesAnalyzeData.discount}}</p>
      </div>
    </div>

    <!--进度条-->
    <div class="progeress_box" >
            <span>指标完成进度：<span class="number_fontSize" style="color:#4796F4;margin-right: 10px">{{salesAnalyzeData.progress}}<i style="color:#4796F4">%</i></span></span>
      <div class="progeress">
        <van-progress :percentage="salesAnalyzeData.progress" stroke-width="8"   color=" #4796F4"/>
      </div>
    </div>

     <!--会员等级金额占比-->
    <div class="chart_box" v-if="vipGradelist.length !==0">
        <div id="vipPie1" :class="className"  style="height: 100%;width:100%"></div>
    </div>
    <div class="chart_nodata_box" v-show="vipGradelist.length===0">
      <p class="_title">会员等级金额占比</p>
      <p class="_noData"> 暂无数据</p>
    </div>

    <!--新老会员金额占比-->
    <div class="chart_box" v-show="vipTypelist.length !==0">
      <div id="vipPie2" :class="className"  style="height: 100%;width:100%"></div>
    </div>
    <div class="chart_nodata_box" v-show="vipTypelist.length===0">
      <p class="_title">新老会员金额占比</p>
      <p class="_noData"> 暂无数据</p>
    </div>

    <!--最近作业趋势走向-->
    <div class="chart_box" v-show="lineLength !==0">
      <div id="line" :class="className"  style="height: 100%;width:100%"></div>
    </div>
    <div class="chart_nodata_box" v-show="lineLength===0">
      <p class="_title">最近作业趋势走向</p>
      <p class="_noData"> 暂无数据</p>
    </div>
  </main>

  <!--  时间弹框-->
  <van-popup
    v-model="showTimePopup"
    position="bottom"
     @close="closePopup"
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
import { getThisMonth, formatNum } from '@/utils';
import { salesAnalyze } from '@/api/retailAnalyze';
import { Dialog } from 'vant';

export default {
  name: 'totalPerformance',
  components: {
    NowStore,
  },
  data() {
    return {
      className: 'chart',
      startDate: '',
      endDate: '',
      showTimePopup: false, // 时间弹框
      timeFlag: '', // 判断点击的是开始时间还是结束时间
      currentDate: new Date(),
      time: new Date(), // 可以选择的最大日期
      salesAnalyzeData: {
        progress: 0,
        discount: 0,
      }, // 业绩分析表

      // 最近6月数据
      salesHistoryData: {
        xAxis: [],
        yAxis: [],
      },
      vipTypelist: [], // 新老会员金额占比
      vipGradelist: [], // 会员等级金额占比
      lineLength: 0, // 折线图数组长度
      animation: true, // 饼图动画效果
      isFirstEnter: false, // 是否第一次进入，默认false
    };
  },
  created() {
    this.isFirstEnter = true;
    this.startDate = getThisMonth(); // 当月1号
    this.endDate = new Date().format('yyyy-MM-dd');
    this.getInfo();

  },
  updated() {
    this.drawVipPie1();
    this.drawVipPie2();
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == 'totalPerformanceDetail') {
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
  computed: {
    // 格式化上期金额
    formatLastTime() {
      if (this.salesAnalyzeData.lastFirstDateKey || this.salesAnalyzeData.lastDateKey) {
        const start = `${this.salesAnalyzeData.lastFirstDateKey.split('-')[1]}/${this.salesAnalyzeData.lastFirstDateKey.split('-')[2]}`;
        const end = `${this.salesAnalyzeData.lastDateKey.split('-')[1]}/${this.salesAnalyzeData.lastDateKey.split('-')[2]}`;
        return `${start}-${end}`;
      }
      return '';
    },
  },
  methods: {
    // 会员等级金额占比
    drawVipPie1() {
      const myChart = this.$echarts.init(document.getElementById('vipPie1'));
      myChart.resize();
      myChart.clear();
      const option = {
        tooltip: {
          trigger: 'item',
          confine: true,
          // 百分比只保留整数
          formatter(data) {
            return `${data.seriesName}<br>${data.name}:${formatNum(data.value)}(${data.percent.toFixed(0)}%)`;
          },
        },
        title: {
          text: '会员等级金额占比',
          textStyle: {
            fontSize: 15,
          },
        },
        animation: this.animation,
        legend: {
          orient: 'horizontal',
          top: '25px',
          data: ['积分卡', '黄金卡', '铂金卡', '非会员'],
          selectedMode: false, // 取消图例上的点击事件
        },
        series: [
          {
            name: '比列',
            type: 'pie',
            radius: '50%',
            center: ['50%', '60%'],
            data: this.vipGradelist,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter(p) {
                    return `${p.name}:(${formatNum(p.value)})元`;
                  },
                  fontSize: 11,
                },
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            labelLine: {
              normal: {
                length: 5,
              },
            },
          },
        ],
      };
      myChart.setOption(option);
    },

    // 新老会员金额占比
    drawVipPie2() {
      const myChart = this.$echarts.init(document.getElementById('vipPie2'));
      myChart.resize();
      myChart.clear();
      const option = {
        tooltip: {
          trigger: 'item',
          confine: true,
          // 百分比只保留整数
          formatter(data) {
            return `${data.seriesName}<br>${data.name}:${formatNum(data.value)}(${data.percent.toFixed(0)}%)`;
          },
        },
        title: {
          text: '新老会员金额占比',
          textStyle: {
            fontSize: 15,
          },
        },
        animation: this.animation,
        legend: {
          orient: 'horizontal',
          top: '25px',
          data: ['新会员', '老会员', '非会员'],
          selectedMode: false, // 取消图例上的点击事件
        },
        series: [
          {
            name: '比列',
            type: 'pie',
            radius: '50%',
            center: ['50%', '60%'],
            data: this.vipTypelist,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter(p) {
                    return `${p.name}:(${formatNum(p.value)})元`;
                  },
                  fontSize: 11,
                },
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            labelLine: {
              normal: {
                length: 5,
              },
            },
          },
        ],
      };
      myChart.setOption(option);
    },

    // 最近作业趋势走向
    drawLine() {
      const myChart = this.$echarts.init(document.getElementById('line'));
      myChart.resize();
      myChart.clear();
      const option = {
        tooltip: {
          trigger: 'axis',
          confine: true,
          // formatter: '{b}:\n{c}',
          formatter(data) {
            return `${data[0].seriesName}<br>${data[0].name}:${formatNum(data[0].value)}`;
          },
        },
        grid: {
          left: '20%',
        },
        title: {
          text: '最近6个月业绩趋势',
          textStyle: {
            fontSize: 15,
          },
        },
        legend: {
          orient: 'horizontal',
          top: 'top',
          right: '10px',
          data: ['销售金额'],
          selectedMode: false, // 取消图例上的点击事件
        },
        xAxis: {
          type: 'category',
          data: this.salesHistoryData.xAxis,
          axisLabel: {
            interval: 0, // 强制显示所有标签
            rotate: 15,
            fontSize: 11,
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          name: '销售金额',
          type: 'line',
          data: this.salesHistoryData.yAxis,
        }],
      };
      myChart.setOption(option);
    },

    getInfo() {
      salesAnalyze({
        firstDateKey: this.startDate,
        dateKey: this.endDate,
      })
        .then(({ data }) => {
          this.salesAnalyzeData = data.salesAnalyzeData; // 业绩分析表
          // this.salesHistoryData = data.salesHistoryData; // 最近6月数据
          const yAxis = data.salesHistoryData.yAxis.map(item => parseInt(item));
          const obj = {
            xAxis: data.salesHistoryData.xAxis,
            yAxis,
          };
          this.salesHistoryData = obj; // 最近6月数据
          //折线图渲染不出来
          this.$nextTick(() => {
            this.drawLine();// 折线图
          });
          this.lineLength = data.salesHistoryData.yAxis.length;// 折线图数组长度
          data.vipTypelist.forEach((item) => {
            // 设置为空就不显示文本标签
            if (item.value == 0) {
              item.value = '';
            }
          });
          data.vipGradelist.forEach((item) => {
            // 设置为空就不显示文本标签
            if (item.value == 0) {
              item.value = '';
            }
          });
          this.vipGradelist = data.vipGradelist; // 会员等级金额占比
          this.vipTypelist = data.vipTypelist; // 新老会员金额占比
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
      // 业绩分析表
      this.salesAnalyzeData = {
        progress: 0,
        discount: 0,
      };
      // 最近6月数据
      this.salesHistoryData = {
        xAxis: [],
        yAxis: [],
      };
      this.vipTypelist = []; // 新老会员金额占比
      this.vipGradelist = []; // 会员等级金额占比
      this.lineLength = 0;
      const chart1 = this.$echarts.init(document.getElementById('vipPie1')); // 饼图1
      chart1.clear();

      const chart2 = this.$echarts.init(document.getElementById('vipPie1')); // 饼图2
      chart2.clear();

      const chart = this.$echarts.init(document.getElementById('line'));// 折线图
      chart.clear();
    },
    // 业绩详情
    toDetail() {
      if (this.salesAnalyzeData.sumAmount == 0) {
        return;
      }
      this.$router.push({
        name: 'totalPerformanceDetail',
        query: {
          storeId: window.localStorage.getItem('storeNo'),
          startDate: this.startDate,
          endDate: this.endDate,
        },
      });
    },
    // 本月1号至 今天
    // resetTime() {
    //   this.startDate = getThisMonth(); // 当月1号
    //   this.endDate = new Date().format('yyyy-MM-dd');
    // },
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
      // if (this.timeFlag === 'start') {
      //   // 判断开始日期的月份 和结束日期的是否相等
      //   if (value.getMonth() + 1 !== this.splitTime(this.endDate)) {
      //     this.$toast.fail('不能跨月查询,请重新选择日期!');
      //   } else {
      //     this.startDate = value.format('yyyy-MM-dd');
      //   }
      // } else if (this.timeFlag === 'end') {
      //   if (value.getMonth() + 1 !== this.splitTime(this.startDate)) {
      //     this.$toast.fail('不能跨月查询,请重新选择日期!');
      //   } else {
      //     this.endDate = value.format('yyyy-MM-dd');
      //   }
      // }
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
    closePopup() {

    },
    closeStorePopup() {
      this.getInfo();
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/assets/style/retailAnalyze.scss";
  .progeress_box{
    display: flex;
    align-items: center;
    /*justify-content: space-around;*/
    height: vw(40);
    background: #fff;
    width: 100%;
    padding: vw(10) vw(15);
    overflow-x:hidden ;
  }
  .progeress{
    width: vw(100);
  }

 .underline{
   border-bottom: 2px solid $theme-color;
 }

</style>
