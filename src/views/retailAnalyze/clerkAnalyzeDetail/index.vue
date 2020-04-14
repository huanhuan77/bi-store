<template>
  <body>
  <main id="main">
    <div class="current_emp">
      <span>当前店员：{{empName}}</span>
    </div>

    <!--表头-->
    <div class="table tableHead" style="margin-top: 0">
      <table border="0" cellspacing="0" cellpadding="0" rules="groups">
        <tbody>
        <tr>
          <td width="25%"><p class="line">名称</p></td>
          <td width="15%"><p class="line">总业绩</p></td>
          <td width="20%"><p class="line">指标</p></td>
          <td width="15%"><p class="line">完成率</p></td>
          <td width="30%" style="position: relative">
            <p class="line">上期</p>
            <div class="dateKey">{{dateKey}}</div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <template v-if="analyzeData.length!==0">
      <div class="table">
        <table border="0" cellspacing="0" cellpadding="0" rules="groups">
          <tbody>
          <tr v-for="(item,index) in analyzeData" :key="index">
            <td width="25%">{{item.name}}</td>
            <td width="15%">{{item.sum|formatAmount}}</td>
            <td width="20%">{{item.target|formatAmount}}</td>
            <td width="15%">{{item.complete}}%</td>
            <td width="30%" style="position: relative">{{item.lastSum|formatAmount}}
              <span class="iconfont icon-shangsheng1 up" v-show="item.lastSum <item.sum"></span>
              <span class="iconfont icon-xiajiang1 down" v-show="item.lastSum > item.sum"></span>
            </td>
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

    <!--会员等级金额占比-->
    <div class="chart_box" v-show="salesPieList.length !==0">
      <div id="vipPie1" :class="className"
           style="height: 100%;width:100%"></div>
    </div>
    <div class="chart_nodata_box" v-show="salesPieList.length===0">
      <p class="_title">店员业绩会员等级占比</p>
      <p class="_noData"> 暂无数据</p>
    </div>


    <!--服务人数/等级人数-->
    <div class="chart_box" v-show="servicePieList.length !==0">
      <div id="vipPie2" :class="className"
           style="height: 100%;width:100%"></div>
    </div>
    <div class="chart_nodata_box" v-show="servicePieList.length ===0">
      <p class="_title">店员所属会员占比</p>
      <p class="_noData"> 暂无数据</p>
    </div>

    <!--最近8周-->
    <div class="chart_box"   v-show="lineLength !==0">
      <div id="line" :class="className" style="height: 100%;width:100%"
         ></div>
    </div>
    <div class="chart_nodata_box" v-show="lineLength===0">
      <p class="_title">最近8周销售金额</p>
      <p class="_noData"> 暂无数据</p>
    </div>
  </main>
  </body>
</template>

<script>
import { empDataAnalyze } from '@/api/retailAnalyze';
import { formatNum } from '@/utils';

export default {
  name: 'clerkAnalyzeDetail',
  data() {
    return {
      className: 'chart',
      storeId: '',
      startDate: '',
      endDate: '',
      empId: '',
      empName: '',
      analyzeData: [], // 表格数据
      salesPieList: [], // 饼图1
      servicePieList: [], // 饼图2
      empSalesRecordData: '', // 折线图
      dateKey: '', // 上期时间
      lineLength: 0,
    };
  },
  created() {
    this.storeId = this.$route.query.storeId;
    this.startDate = this.$route.query.startDate;
    this.endDate = this.$route.query.endDate;
    this.empId = this.$route.query.empId;
    this.empName = this.$route.query.empName;
    this.getInfo();
  },
  updated() {
    this.drawVipPie1();
    this.drawVipPie2();
    this.drawLine();// 折线图
  },

  methods: {
    getInfo() {
      empDataAnalyze({
        storeId: this.storeId,
        startDate: this.startDate,
        endDate: this.endDate,
        empId: this.empId,
      })
        .then(({ data }) => {
          this.analyzeData = data.analyzeData;
          this.dateKey = data.dateKey;// 上期时间
          // 饼图1
          if (data.salesPieList.length !== 0) {
            // 数据为0  标签不显示
            data.salesPieList.forEach((item) => {
              if (item.value === 0) {
                item.value = '';
              }
            });
            // 判断是否全部的数据都为0  如果为0 赋值为空
            const isNull = data.salesPieList.every(item => item.value == '');
            // const isNull = this.isNull(data.salesPieList);
            if (!isNull) {
              this.salesPieList = data.salesPieList;// 饼图1
            } else {
              this.salesPieList = [];
            }
          }
          // 饼图2
          if (data.servicePieList.length !== 0) {
            data.servicePieList.forEach((item) => {
              if (item.value === 0) {
                item.value = '';
              }
            });
            const isNull = data.servicePieList.every(item => item.value == '');
            if (!isNull) {
              this.servicePieList = data.servicePieList;// 饼图2
            } else {
              this.servicePieList = [];
            }
          }

          // 折线图
          if (data.empSalesRecordData.yAxis.length !== 0) {
            const isNull = data.empSalesRecordData.yAxis.every(item => item === null || item === 'null');
            if (!isNull) {
              this.empSalesRecordData = data.empSalesRecordData; // 折线图
            } else {
              this.empSalesRecordData = {
                xAxis: [],
                yAxis: [],
              };
            }
          }
          this.lineLength = data.empSalesRecordData.yAxis.length;
        })
        .catch((err) => {
          console.log(err);
          this.clearData();
        });
    },
    clearData() {
      this.analyzeData = '';
      this.salesPieList = [];
      this.servicePieList = [];
      this.empSalesRecordData = '';
      this.dateKey = '';
      this.lineLength = 0;

      const chart1 = this.$echarts.init(document.getElementById('vipPie1'));
      chart1.clear();

      const chart2 = this.$echarts.init(document.getElementById('vipPie2'));
      chart2.clear();

      const chart3 = this.$echarts.init(document.getElementById('line'));
      chart3.clear();
    },
    // 会员等级金额占比
    drawVipPie1() {
      const myChart = this.$echarts.init(document.getElementById('vipPie1'));
      myChart.resize();
      myChart.clear();
      const option = {
        tooltip: {
          trigger: 'item',
          // 百分比只保留整数
          formatter(data) {
            return `${data.seriesName}<br>${data.name}:${formatNum(data.value)}(${data.percent.toFixed(0)}%)`;
          },
        },
        title: {
          text: '店员业绩会员等级占比',
          textStyle: {
            fontSize: 15,
          },
        },
        legend: {
          orient: 'horizontal',
          top: '25px',
          data: ['非会员', '积分卡', '黄金卡', '铂金卡'],
          selectedMode: false, // 取消图例上的点击事件
        },
        series: [
          {
            name: '比列',
            type: 'pie',
            radius: '50%',
            center: ['50%', '60%'],
            data: this.salesPieList,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter(p) {
                    return `${p.name}:(${formatNum(p.value)})人`;
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
      myChart.setOption(option);
    },
    // 服务人数/等级人数
    drawVipPie2() {
      const myChart = this.$echarts.init(document.getElementById('vipPie2'));
      myChart.resize();
      myChart.clear();
      const option = {
        tooltip: {
          trigger: 'item',
          // 百分比只保留整数
          formatter(data) {
            return `${data.seriesName}<br>${data.name}:${formatNum(data.value)}(${data.percent.toFixed(0)}%)`;
          },
        },
        title: {
          text: '店员所属会员占比',
          textStyle: {
            fontSize: 15,
          },
        },

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
            data: this.servicePieList,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter(p) {
                    return `${p.name}:(${formatNum(p.value)})人`;
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
      myChart.setOption(option);
    },

    drawLine() {
      const myChart = this.$echarts.init(document.getElementById('line'));
      myChart.resize();
      myChart.clear();
      const option = {
        tooltip: {
          trigger: 'axis',
          // formatter: '{b}<br/>销售金额：{c}',
          formatter(data) {
            return `${data[0].name}</br>${data[0].seriesName}：${formatNum(data[0].value)}`;
          },
        },
        title: {
          text: `最近8周销售金额(${this.empSalesRecordData.dateKeyWeek})`,
          textStyle: {
            fontSize: 15,
          },
        },
        grid: {
          left: '25%',
        },
        legend: {
          orient: 'horizontal',
          top: '25px',
          data: ['销售金额'],
          selectedMode: false, // 取消图例上的点击事件
        },
        xAxis: {
          type: 'category',
          data: this.empSalesRecordData.xAxis,
          axisLabel: {
            interval: 0,
            rotate: 28,
            fontSize: 11,
          },

        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 11,
          },
        },
        series: [{
          name: '销售金额',
          type: 'line',
          data: this.empSalesRecordData.yAxis,
        }],
      };
      myChart.setOption(option);
    },
  },
};
</script>

<style scoped lang="scss">
  @import "@/assets/style/retailAnalyze.scss";

  .content_table_item {
    width: vw(88) !important;
  }

  .color_theme {
    padding: 0 !important;
  }

  .content_table_box .content_table_item span {
    padding: 0 !important;
  }

  .line {
    height: vw(40);
  }

  .dateKey {
    font-size: vw(12);
    height: vw(20);
    width: 100%;
    position: absolute;
    bottom: vw(4);
    left: 50%;
    transform: translateX(-50%);
  }

.current_emp{
  height: vw(40);
  line-height: vw(40);
  background: #fff;
  margin-bottom: vw(8);
  padding-left: vw(15);

}
</style>
