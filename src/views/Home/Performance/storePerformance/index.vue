<template>
  <body>
  <MenuButton :typeIndex="typeIndex" :typeList="typeList" @changeType="changeType"></MenuButton>
  <main>
    <div class="mm-content">
      <div class="rangeBox">
        <div style="text-align: center">
          <yd-countup :endnum="isNull(rank.rankNum)" startnum="0" class="number" :duration="1"
                      separator=","></yd-countup>
          <p>本月区域业绩排名</p>
        </div>
        <div style="text-align: center">
          <span class="rank">（在全区域 {{isNull(rank.storeNum)}} 家门店排名）</span>
          <yd-countup :endnum="isNull(rank.completeRanking)" startnum="0" class="number" :duration="1"
                      separator=","></yd-countup>
          <p>本月区域达成率排名</p>
        </div>
      </div>

      <div class="timeBox">
        <TimeButton :timeIndex="timeIndex" :timeList="timeList" @changeTime="changeTime"></TimeButton>

        <p style="margin-top: 5px"><i v-if="status==0">今日</i><i v-if="status==1">昨日</i> <i v-if="status==2">本周</i><i
          v-if="status==3">本月</i>销售金额</p>
        <p @click.prevent="chartDetail" class="hong">{{money | NumFormat }}
          <i style="color: #ccc;font-size: vw(10);"> 元</i>
        </p>

        <div class="line"></div>
        <!--图表-->
        <div class="chart_box">
          <div :class="className" :id="id" :style="{height:'100',width:'100'}" ref="myEchart"
               v-show="yAxis.length!=0">
          </div>
          <div class="no_data" v-show="yAxis.length==0">暂无数据</div>
        </div>

      </div>
      <div class="table">
        <table border="0" cellspacing="0" cellpadding="0">
          <tbody>
          <tr>
            <td>
              <p>销售数量</p>
              <p>{{isNull(tableData.sumOrderQty)}}</p>
            </td>
            <td>
              <p>小票笔数</p>
              <p>{{isNull(tableData.sumOrderNumber)}}</p>
            </td>
            <td>
              <p>笔单价</p>
              <p>{{isNull(tableData.sumAmount)}}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>会员销售比</p>
              <p>{{isNull(tableData.vipSalesPercentage)}}</p>
            </td>
            <td>
              <p>会员笔数</p>
              <p>{{isNull(tableData.sumVipOrderNumber)}}</p>
            </td>
            <td>
              <p>会员笔单价</p>
              <p>{{isNull(tableData.sumVipAmount)}}</p>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
  </body>
</template>

<script>
  import MenuButton from '@/components/menu-button.vue';
  import TimeButton from '@/components/time-button.vue';
  import echarts from 'echarts';
  import { storePerformance, storeRange } from '@/api/sales';

  export default {
    name: 'storePerformance',
    components: {
      TimeButton,
      MenuButton,
    },
    data() {
      return {
        typeIndex: 1,
        typeList: [
          {
            value: 1,
            name: '店铺业绩',
          },
          {
            value: 2,
            name: '店铺会员招募',
          },
          {
            value: 3,
            name: '店铺储值卡',
          }],
        timeList: [
          {
            value: 1,
            name: '实时',
          },
          {
            value: 2,
            name: '日',
          },
          {
            value: 3,
            name: '周',
          },
          {
            value: 4,
            name: '月',
          }],
        timeIndex: 1,
        rank: {},
        storeBranch: '', // 区域市场
        money: '', // 销售金额
        tableData: {}, // 表格数据
        yAxis: [],
        xAxis: [],
        status: 0, // 时间状态 0为实时 1为日 2为周 3为月
      };
    },
    created() {
      this.storeBranch = window.localStorage.getItem('areaName');
      this.getRange();
      this.getStorePerformance();
    },
    updated() {
      // 等data更新后触发
      if (this.yAxis.length === 0 && this.xAxis.length === 0) return;
      this.drawChart();
    },
    methods: {
      // 类别
      changeType(id) {
        if (id == 1) {
          this.$router.push({ name: 'storePerformance' });
        } else if (id == 2) {
          this.$router.push({ name: 'memberRecruit' });
        } else if (id == 3) {
          this.$router.push(({ name: 'valueCard' }));
        }
      },
      // 时间分类
      changeTime(id) {
        if (this.timeIndex == id) return;
        this.timeIndex = id;
        this.status = this.timeIndex - 1;
        this.xAxis = [];
        this.yAxis = [];
        this.getStorePerformance();
      },
      // 业绩图表详情
      chartDetail() {
        if (this.status == 0) return;
        this.$router.push({
          name: 'storePerformanceDetail',
          query: { status: this.status },
        });
      },
      // 获取业绩详情数据
      getStorePerformance() {
        storePerformance({
          storeBranch: decodeURI(this.storeBranch),
          status: this.status,
        })
          .then(({ data }) => {
            this.money = data.BottomTableData.salesAmount;
            this.tableData = data.BottomTableData;
            // 图表数据
            if (data.ChartData.yAxis.length !== 0) {
              let result = data.ChartData.yAxis.every((item) => {
                return item == null;
              });
              this.yAxis = result ? [] : data.ChartData.yAxis;
            } else {
              this.yAxis = data.ChartData.yAxis;
            }
            this.xAxis = data.ChartData.xAxis;// x
          })
          .catch(() => {
            this.money = 0;
            this.tableData = [];
            this.yAxis = [];
            this.xAxis = [];
          });
      },
      getRange() {
        storeRange({
          storeBranch: decodeURI(this.storeBranch),
        })
          .then(({ data }) => {
            this.rank = data;
          })
          .catch(() => {
            this.rank = {};
          });
      },
      // 图表
      drawChart() {
        let chart = echarts.init(this.$refs.myEchart);
        chart.clear();
        // 把配置和数据放这里
        chart.setOption({
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          grid: {
            left: '3%',
            right: '3%',
            bottom: '0%',
            top: '6%',
            containLabel: true,
            show: true,
            borderColor: '#fff',
          },
          legend: {
            data: '销售额',
          },
          xAxis: {
            type: 'category',
            data: this.xAxis,
            axisLabel: {
              interval: 0,
              rotate: 28,
              fontSize: 10,
            },
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              fontSize: 10,
            },
            axisLine: {
              show: false,
            },
          },
          series: [{
            name: '销售额',
            type: 'bar',
            barWidth: '60%',
            legendHoverLink: false,
            data: this.yAxis,
          }],
        });
      },
      isNull(value) {
        if (value == null || value == 0) return 0;
        return value;
      },
      // 下拉刷新
      onRefresh() {
        setTimeout(() => {
          this.getRange();
          this.getStorePerformance();
        }, 500);
      },
    },
    props: {
      className: {
        type: String,
        default: 'chart',
      },
      id: {
        type: String,
        default: 'yourID',
      },
    },
  };
</script>

<style scoped lang="scss">
  .mm-content {
    /*区域排名*/
    .rangeBox {
      padding: 0 vw(10);
      height: vw(80);
      background: #fff;
      margin-top: vw(8);
      display: flex;
      position: relative;
      justify-content: space-around;

      .number {
        text-align: center;
        font-size: vw(25);
        font-weight: 500;
        height: vw(30);
      }

      div {
        margin: auto 0;
      }

      .rank {
        font-size: vw(10);
        color: #666;
        position: absolute;
        top: 0;
        right: 0;
      }

    }

    /*时间分类*/
    .timeBox {
      margin-top: vw(8);
      background: #fff;
      padding: vw(10);

      p {
        height: vw(30);
        line-height: vw(30);
      }

      /*分割线*/
      .line {
        width: 100%;
        height: vw(3);
        background: #0F90D2;
      }

      .chart_box {
        width: 100%;
        height: vw(200);
        line-height: vw(200);
        text-align: center;
        font-size: vw(30);
        background: #fff;
        border: 1px solid $border_color;
        margin-top: vw(8);
        color: #ddd;

        .chart {
          width: 100%;
          height: vw(200);

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
    }

    .hong {
      font-size: vw(16);
      color: $hong_color;
    }

    /*表格*/
    .table {
      height: vw(130);
      background: #fff;
      margin-top: vw(8);
      position: relative;

      table {
        width: 80%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid $tableBorder;

        tr {
          td {
            padding: vw(5) 0;
            text-align: center;

            p {
              height: vw(20);
              line-height: vw(20);
            }
          }

          td ~ td {
            border-left: 1px solid $tableBorder;
          }
        }

        tr:first-of-type {
          td {
            border-bottom: 1px solid $tableBorder;
          }
        }
      }
    }

    .money {
      display: inline-block;
      font-size: vw(18);
      width: vw(200);
      position: relative;
      color: $theme-color;

      i {
        color: #ddd;
        font-size: vw(10);
      }

      .yd-badge {
        width: vw(6);
        height: vw(6);
        position: absolute;
        top: -vw(2);
        right: vw(18);
      }
    }

    .disabled {
      font-size: vw(18);
      color: #000;
    }
  }

</style>
