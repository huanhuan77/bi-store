<template>
  <body>
  <div class="time_header">
    <div class="time_box">
      <div @click="openTimePopup('start')">{{startDate}}</div>
      <span>--</span>
      <div @click="openTimePopup('end')">{{endDate}}</div>
    </div>

    <div @click="search" class="timeRange">
<!--      <i class="iconfont icon-riqi icon"></i>-->
      <span class="search">查询</span>
    </div>
  </div>

  <NowStore @closePopup="closePopup"></NowStore>

  <main style="margin: 10px 0">
    <div class="consume_box">
      <div class="consume_box_header">
        <div class="consume_box_header_title">
          <i class="iconfont icon-xiaofei icon"></i>
          <span>会员消费</span>
        </div>

        <p>会员消费总人数</p>
        <p>
          <span style="font-size: 25px" >{{sales.totalNum|formatAmount}}</span>
        </p>
        <div class="consume_box_header_openCard">
          <i class="iconfont icon-VIP icon"></i>
          <div>
            <p>新会员消费人数</p>
            <p class="number_fontSize">{{sales.newNum|formatAmount}}</p>
          </div>
          <div>
            <p>老会员消费人数</p>
            <p class="number_fontSize">{{sales.oldNum|formatAmount}}</p>
          </div>
        </div>

      </div>
    </div>

    <div class="consume_content">
      <div class="consume_content_item_box">
        <!--        消费金额-->
        <div class="consume_content_item br bb">
          <p>
            <i class="iconfont icon-danjia icon"></i>
            <span>会员消费金额</span>
          </p>
          <p class="number_fontSize">{{sales.toltalVipAmount|formatAmount}} <i>元</i></p>
        </div>

        <!-- 消费数量-->
        <div class="consume_content_item bb">
          <p>
            <i class="iconfont icon-shuliang1 icon"></i>
            <span>会员消费数量</span>
          </p>
          <p class="number_fontSize">{{sales.totaViplQty|formatAmount}} <i>个</i></p>
        </div>
      </div>


      <div class="consume_content_item_box">
        <!--环比金额-->
        <div class="consume_content_item bb br">
          <p>
            <i class="iconfont icon-danjia icon"></i>
            <span>上期会员消费金额</span>
          </p>
          <div  style="font-size: 12px;"> {{sales.previousDate}}</div>
          <p class="number_fontSize" style="color:#4F77AA">{{sales.previousVipAmount|formatAmount}} <i>元</i></p>
        </div>
        <!--        环比数量-->
        <div class="consume_content_item bb">
          <p>
            <i class="iconfont icon-shuliang1  icon"></i>
            <span>上期会员消费数量</span>
          </p>
          <div  style="font-size: 12px;"> {{sales.previousDate}}</div>
          <p class="number_fontSize" style="color:#4F77AA">{{sales.previousVipQty|formatAmount}} <i>个</i></p>
        </div>
      </div>

      <div class="consume_content_item_box bb">
        <!-- 金额环比增长率-->
        <div class="consume_content_item br">
          <p>
            <i class="iconfont icon-icon-ayear icon"></i>
            <span>金额环比增长率</span>
          </p>
          <p class="number_fontSize">{{sales.previousVipAmountRate |formatPercent}} <i>%</i></p>
        </div>
        <!-- 环比增长率-->
        <div class="consume_content_item">
          <p>
            <i class="iconfont icon-icon-ayear icon"></i>
            <span>数量环比增长率</span>
          </p>
          <p class="number_fontSize">{{sales.previousViplQtytRate|formatPercent}} <i>%</i></p>
        </div>
      </div>

      <div class="consume_content_item_box">
        <!--客单价-->
        <div class="consume_content_item br">
          <p>
            <i class="iconfont icon-youhuiquan1 icon"></i>
            <span>本期客单价</span>
          </p>
          <p class="number_fontSize">{{sales.unitPrice|formatAmount}} <i>元</i></p>
          <p class="formula">会员消费金额/会员消费单数</p>
        </div>

        <!--消费占比-->
        <div class="consume_content_item">
          <p>
            <i class="iconfont icon-huiyuanxiaofeizhanbi icon"></i>
            <span>本期会员消费占比</span>
          </p>
          <p class="number_fontSize">{{sales.vipSalesProportion |formatPercent}} <i>%</i></p>
          <p class="formula">会员消费金额/总消费金额</p>
        </div>
      </div>
      <!--柱状图-->
      <div class="chart_box"    v-show="discountData">
        <div id="myEchart" :class="className" :style="{height:'100',width:'100'}" ref="myEchart"
          ></div>
      </div>
      <div class="chart_nodata_box"  v-show="!discountData">
        <p class="_title">会员等级平均折扣</p>
        <p class="_noData"> 暂无数据</p>
      </div>

      <!--饼图1-->
      <div class="chart_box" v-show="vipData.length !==0">
        <div :class="className" id="myPieEchart1" :style="{height:'100',width:'100'}"
             ref="myPieEchart1" ></div>
      </div>
      <div class="chart_nodata_box"  v-show="vipData.length ===0">
        <p class="_title">新老会员消费金额占比</p>
        <p class="_noData"> 暂无数据</p>
      </div>

      <!--饼图2-->
      <div class="chart_box" v-show="gradeData.length !==0">
        <div :class="className" id="myPieEchart2" :style="{height:'100',width:'100'}"
             ref="myPieEchart2" ></div>
      </div>
      <div class="chart_nodata_box"  v-show="gradeData.length ===0">
        <p class="_title">等级金额占比</p>
        <p class="_noData"> 暂无数据</p>
      </div>
    </div>
  </main>

  <!--  时间弹框-->
  <van-popup v-model="showTimePopup" position="bottom"  close-on-popstate>
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
import { vipSale } from '@/api/vipAnalysis';
import echarts from 'echarts';
import NowStore from '@/components/nowStore.vue';
import { formatNum } from '@/utils';
import {Dialog} from "vant";

export default {
  name: 'index',
  components: {
    NowStore,
  },
  data() {
    return {
      showTimePopup: false, // 时间弹框
      timeFlag: '', // 判断点击的是开始时间还是结束时间
      currentDate: new Date(),
      time: new Date(), // 可以选择的最大日期
      startDate: '',
      endDate: '',
      sales: '',
      pieData1: [], // 饼图1
      discountData: '', // 柱状图数据
      vipData: [], // 新老会员占比
      gradeData: [], // 等级金额占比
      // 筛选
      show: false,
      radioStoreName: '',
      storeList: [],
      radioStore: 1,
      isFirstEnter: false, // 是否第一次进入，默认false
    };
  },
  created() {
    this.isFirstEnter = true;
    this.startDate = this.formatDate(6); // 最近七天
    this.endDate = new Date().format('yyyy-MM-dd');
    this.getVipSale();
  },
  updated() {
    this.drawChart();// 柱状图
    this.drawPieChart1();// 饼图1
    this.drawPieChart2();// 饼图2
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == 'empSales') {
      to.meta.isBack = true;
    }
    next();
  },

  activated() {
    if (!this.$route.meta.isBack || this.isFirstEnter) {
      this.startDate = this.formatDate(6); // 最近七天
      this.endDate = new Date().format('yyyy-MM-dd');
      this.getVipSale();
    }
    this.$route.meta.isBack = false;
    this.isFirstEnter = false;
  },
  methods: {
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
    // 关闭弹框
    closePopup() {
      this.getVipSale();
    },
    search() {
      if (this.startDate > this.endDate) {
        Dialog.alert({
          message: '开始日期不能大于结束日期!',
        }).then(() => {

        });
        return;
      }
      this.getVipSale();
    },
    // 计算最近七天
    formatDate(time) {
      const date1 = new Date();
      const date2 = new Date(date1);
      date2.setDate(date1.getDate() - time);
      const Y = date2.getFullYear();
      const M = (date2.getMonth() + 1 < 10 ? `0${date2.getMonth() + 1}` : date2.getMonth() + 1);
      const D = (date2.getDate() < 10 ? `0${date2.getDate()}` : date2.getDate());
      const time2 = `${Y}-${M}-${D}`;
      return time2;
    },

    getVipSale() {
      vipSale({
        startDate: this.startDate,
        endDate: this.endDate,
      })
        .then(({ data }) => {
          this.sales = data.sales;
          this.discountData = data.discountData;
          data.vipData.forEach((item) => {
            if (item.value == 0) {
              item.value = '';
            }
          });
          this.vipData = data.vipData;
          data.gradeData.forEach((item) => {
            if (item.value == 0) {
              item.value = '';
            }
          });
          this.gradeData = data.gradeData;
        })
        .catch(() => {
          this.clearData();
        });
    },
    // 柱状图
    drawChart() {
      const chart = echarts.init(document.getElementById('myEchart'));
      chart.clear();
      chart.resize();
      // 把配置和数据放这里
      chart.setOption({
        title: {
          text: '会员等级平均折扣',
          textStyle: {
            fontSize: 15,
          },
        },
        tooltip: {
          trigger: 'item',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line', // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: '{b}:\n{c}',

        },
        legend: {
          data: ['折扣'],
          selectedMode: false, // 取消图例上的点击事件
          left: '40%',
        },

        grid: {
          left: '3%',
          right: '3%',
          bottom: '0%',
          top: '17%',
          containLabel: true,
          show: true,
          borderColor: '#fff',
        },
        xAxis: {
          type: 'category',
          data: this.discountData.title,
          axisLabel: {
            fontSize: 12,
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 10,
            formatter: '{value}',
          },
          axisLine: {
            show: false,
          },

        },
        series: [
          // {
          //   name: '金额',
          //   type: 'bar',
          //   barWidth: '20%',
          //   data: this.yAxis,
          //   itemStyle: { color: '#c23531' },
          // },
          // {
          //   name: '数量',
          //   type: 'bar',
          //   barWidth: '20%',
          //   data: this.yAxis,
          //   itemStyle: { color: '#2f4554' },
          // },
          {
            name: '折扣',
            type: 'bar',
            barWidth: '40%',
            data: this.discountData.disList,
            color: '#61a0a8',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  // formatter(p) {
                  //   return `${p.value}`;
                  // },
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
      });
    },

    // 饼图1
    drawPieChart1() {
      const chart = echarts.init(document.getElementById('myPieEchart1'));
      chart.resize();
      chart.clear();
      // 把配置和数据放这里
      const option = {
        tooltip: {
          trigger: 'item',
          // formatter: '{a} <br/>{b} : {c} ({d}%)',
          // 百分比只保留整数 数值设置千分位
          formatter(data) {
            return `${data.seriesName}<br>${data.name}:${formatNum(data.value)}(${data.percent.toFixed(0)}%)`;
          },
        },
        title: {
          text: '新老会员消费金额占比',
          textStyle: {
            fontSize: 15,
          },
        },
        legend: {
          orient: 'horizontal',
          top: 'top',
          left: '50%',
          data: ['新会员', '老会员'],
          selectedMode: false, // 取消图例上的点击事件
        },
        series: [
          {
            name: '比列',
            type: 'pie',
            radius: '45%',
            center: ['50%', '60%'],
            data: this.vipData,
            label: {
              fontSize: 13,
              normal: {
                textStyle: {
                  fontSize: 13,
                },
              },
            },
            labelLine: {
              normal: {
                length: 5,
              },
            },
            itemStyle: {
              // 标签显示数值
              normal: {
                label: {
                  show: true,
                  // formatter: '{b}:({c})人',
                  formatter(p) {
                    return `${p.name}:(${formatNum(p.value)})元`;
                  },
                },
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },

            },
          },
        ],
      };

      chart.setOption(option);
    },

    // 饼图2
    drawPieChart2() {
      const chart = echarts.init(document.getElementById('myPieEchart2'));
      chart.resize();
      chart.clear();
      // 把配置和数据放这里
      const option = {
        tooltip: {
          trigger: 'item',
          // formatter: '{a} <br/>{b} : {c} ({d}%)',
          // 百分比只保留整数
          formatter(data) {
            return `${data.seriesName}<br>${data.name}:${formatNum(data.value)}(${data.percent.toFixed(0)}%)`;
          },
        },
        title: {
          text: '等级金额占比',
          textStyle: {
            fontSize: 15,
          },
        },
        legend: {
          orient: 'horizontal',
          top: 'top',
          left: '40%',
          data: ['积分卡', '黄金卡', '铂金卡'],
          selectedMode: false, // 取消图例上的点击事件
        },

        series: [
          {
            name: '比列',
            type: 'pie',
            radius: '45%',
            center: ['50%', '60%'],
            data: this.gradeData,
            label: {
              fontSize: 12,
              normal: {
                textStyle: {
                  fontSize: 13,
                },
              },
            },
            labelLine: {
              normal: {
                length: 5,
              },
            },
            itemStyle: {
              // 标签显示数值
              normal: {
                label: {
                  show: true,
                  // formatter: '{b}:({c})人',
                  formatter(p) {
                    return `${p.name}:(${formatNum(p.value)})元`;
                  },
                },
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };

      // 查询数据后,更新配置
      chart.setOption(option);
    },
    // 格式化柱状图  百分比
    // formatData(data) {
    //   const obj = {
    //     disList: [],
    //     title: [],
    //   };
    //   if (data.disList.length !== 0) {
    //     data.disList.forEach((item) => {
    //       // const a = item * 100;
    //       const a = parseFloat((item * 100).toPrecision(12));
    //       obj.disList.push(a);
    //     });
    //   }
    //   obj.title = data.title;
    //   return obj;
    // },
    clearData() {
      this.sales = '';
      this.discountData = '';
      this.vipData = [];
      this.gradeData = [];
      const chart1 = echarts.init(document.getElementById('myEchart')); // 柱状图
      chart1.clear();

      const chart2 = echarts.init(document.getElementById('myPieEchart1')); // 饼图1
      chart2.clear();

      const chart = echarts.init(document.getElementById('myPieEchart2'));
      chart.clear();
    },
    // toDetail() {
    //   if (this.sales.totalNum == 0 || this.sales.totalNum === undefined) return;
    //   this.$router.push({
    //     name: 'empSales',
    //     query: {
    //       storeId: window.localStorage.getItem('storeNo'),
    //       startDate: this.startDate,
    //       endDate: this.endDate,
    //     },
    //   });
    // },
    // sevenDay() {
    //   this.startDate = this.formatDate(6); // 最近七天
    //   this.endDate = new Date().format('yyyy-MM-dd');
    //   this.getVipSale();
    // },
  },
  props: {
    className: {
      type: String,
      default: 'chart',
    },

  },
};
</script>

<style lang="scss">
    //头部时间选择
    //头部时间选择
    .time_header {
      height: vw(50);
      line-height: vw(50);
      background: $theme-color;
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: #fff;
      padding: 0 vw(15);
      span {
        margin: 0 vw(5);
      }

      .time_box {
        display: flex;
        align-items: center;
        font-size: vw(14);
        div {
          border: 1px solid #fff;
          border-radius: vw(15);
          width: vw(120);
          height: vw(30);
          line-height: vw(30);
          text-align: center;
        }

        div:active {
          opacity: .6;
        }
      }

      .timeRange :active {
        opacity: .6;
      }

      .search{
        font-size: vw(15);
      }
    }

  .consume_box {
    margin: 0 vw(10);
    .consume_box_header {
      padding: vw(5) vw(15);
      background: $theme-color;
      border-radius: vw(5) vw(5) 0 0;
      color: #fff;

      .consume_box_header_title {
        height: vw(30);
        line-height: vw(30);

        span {
          margin: 0 vw(10);
        }
      }

      p {
        text-align: center;
      }

      p:nth-child(3) {
        height: vw(35);
        line-height: vw(35);
        font-weight: bold;
      }

      .consume_box_header_openCard {
        display: flex;
        align-items: center;
        height: vw(45);

        div {
          flex-grow: 1;
          position: relative;

          p:nth-child(2) {
            font-weight: bold;
          }
        }

        div:nth-child(2)::after {
          content: '';
          width: 2px;
          height: vw(30);
          background: #fff;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          opacity: .6;
        }

      }
    }

  }

  .consume_content {
    margin: 0 vw(10);
    display: flex;
    flex-wrap: wrap;
    background: #fff;

    .consume_content_item_box {
      width: 100%;
    }

    .consume_content_item {
      width: 50%;
      display: inline-flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      padding: vw(10) 0;

      i {
        color: $theme-color;
      }

      span {
        color:$gray_color;
        padding-left: vw(10);
      }

      p:nth-child(2) {
        font-weight: bold;
        color: $theme-color;
      }

      p {
        height: vw(27);
        line-height: vw(27);
      }
    }
  }

  .br {
    border-right: 1px solid $border_color;
  }

  .bb {
    border-bottom: 1px solid $border_color;
  }

  .number_fontSize {
    font-size: vw(18);
    font-weight: bold;
  }

  .icon {
    font-size: vw(20);
  }

  .chart_box {
    width: 100%;
    height: vw(250);
    line-height: vw(250);
    text-align: center;
    font-size: vw(30);
    background: #fff;
    border: 1px solid $border_color;
    border-top: vw(8) solid $border_color;
    color: #ddd;
    padding: vw(5) 0;

    .chart {
      width: 100%;
      height: vw(235);

      canvas {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0);
      }
    }

    .no_data {
      height: vw(30);
      font-size: vw(30);
      font-weight: 400;
    }
  }

  #reset {
    margin-right: vw(15);
    background: $body_background_color;
    color: #1989fa;
  }

  .formula {
    font-size: 12px;
    color: #959595;
  }

  .sevenDay{
    font-size: vw(14);
  }
  .sevenDay :active{
    opacity: .6;
  }
</style>
