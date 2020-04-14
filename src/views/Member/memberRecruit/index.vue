<template>
  <body>
  <MenuButton :typeIndex="typeIndex" :typeList="typeList" @changeType="changeType"></MenuButton>
  <main>
    <div class="mm-content">
      <div class="rangeBox">
        <div style="text-align: center">
          <span class="rank">（在全区域 {{ranks.storeAreaSummary}} 家门店排名）</span>
          <yd-countup :endnum="ranks.monthRecruitRank" :startnum="0" class="number" :duration="1"></yd-countup>
          <p>本月区域招募排名</p>
        </div>
        <div style="text-align: center">
          <yd-countup :endnum="ranks.monthRecruitRate" :startnum="0" class="number" :duration="1"
          ></yd-countup>
          <p>本月区域达成率排名</p>
        </div>
      </div>
      <div class="timeBox">
        <TimeButton :timeIndex="time_active" :timeList="timeList" @changeTime="changeTime"></TimeButton>
        <!--<div class="time_buttons">-->
          <!--<div v-for="time in timeList" :key="time.value"-->
               <!--:class="[time_active==time.value?'time_active':'']"-->
               <!--@click="changeTime(time.value)"-->
          <!--&gt;{{time.name}}-->
          <!--</div>-->
        <!--</div>-->
        <p style="margin-top: 5px">
          <i v-if="time_active==1">今日</i><i v-if="time_active==2">昨日</i> <i v-if="time_active==3">本周</i><i
          v-if="time_active==4">本月</i>会员招募
        </p>
        <p @click="detail" class="hong">{{total}}<i style="color: #ccc;">人</i></p>
        <div class="line"></div>
        <!--图表-->
        <div class="chart_box">
          <div :class="className" :id="id" :style="{height:'100',width:'100'}" ref="myEchart"
               v-show="yAxis.length !=0"></div>
          <div class="no_data" v-show="yAxis.length==0">暂无数据</div>
        </div>
      </div>

      <div class="tableBox">
        <div class="table_header ">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td>会员卡号</td>
              <td width="30%">姓名</td>
              <td width="30%">招募人</td>
            </tr>
          </table>
        </div>
        <div class="table_main">
          <template v-if="recruitList.length !=0">
            <van-list
              :offset="10"
              :immediate-check="false"
              v-model="loading"
              :finished="finished"
              finished-text=""
              @load="onLoad">
              <table border="0" cellspacing="0" cellpadding="0">
                <tbody>
                <tr v-for="(list,index) in recruitList" :key="index">
                  <td>
                    {{list.vipNum}}
                  </td>
                  <td width="30%">
                    {{list.vipName}}
                  </td>
                  <td width="30%">
                    {{list.empName}}
                  </td>
                </tr>
                </tbody>
              </table>
            </van-list>
          </template>
          <template v-else>
            <div class="noData">
              暂无数据
            </div>
          </template>
        </div>
      </div>
    </div>
    <yd-backtop></yd-backtop>
  </main>
  </body>
</template>

<script>
  import TabBar from '@/components/tab-bar.vue';
  import TimeButton from '@/components/time-button.vue';
  import HeaderBar from '@/components/header-bar.vue';
  import MenuButton from '@/components/menu-button.vue';
  import { rank, vipRecruitList, vipRecruitChart } from '@/api/vip';
  import echarts from 'echarts';

  export default {
    name: 'memberRecruit',
    components: {
      HeaderBar,
      TabBar,
      MenuButton,
      TimeButton,
    },
    data() {
      return {
        typeIndex: 2,
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
        time_active: 1,
        ranks: { // 排名
          monthRecruitRate: 0,
          monthRecruitRank: 0,
        },
        recruitList: [], // 招募列表
        pageSize: 10,
        pageNumber: 1,
        loading: false,
        finished: false,
        isLoading: false,
        total: 0,

        // tableData: {}, // 表格数据
        yAxis: [],
        xAxis: [],
      };
    },
    created() {
      this.getRank();
      // this.getVipRecruitList();
      // this.getVipRecruitChart();
      this.setPromise();
    },
    updated() {
      // 等data更新后触发
      if (this.yAxis.length === 0 && this.xAxis.length === 0) return;
      this.drawChart();
    },
    methods: {
      // 类别
      changeType(id) {
        // this.typeIndex = id;
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
        if (this.time_active === id) return;
        this.time_active = id;
        this.pageNumber = 1; // 重置页码
        this.finished = false;
        this.xAxis = [];
        this.yAxis = [];
        this.setPromise();
        // this.getVipRecruitChart();
      },
      // 业绩详情
      detail() {
        if (this.time_active != 1) {
          this.$router.push({
            name: 'memberRecruitDetail',
            query: { id: this.time_active },
          });
        }
      },
      // 排名
      getRank() {
        rank({
          storeBranch: window.localStorage.getItem('areaName'),
        })
          .then((res) => {
            this.ranks = res.data;
          });
      },
      /**
       * Created by zyj on 2019-9-3
       * 处理多个异步操作
       */
      setPromise() {
        Promise.all([
          vipRecruitChart({
            type: this.time_active,
          }),
          vipRecruitList({
            pageSize: this.pageSize,
            pageNumber: this.pageNumber,
            type: this.time_active,
          })
        ])
          .then((res) => {
            if (res[0].data.yAxis.length !== 0) {
              let result = res[0].data.yAxis.every((item) => {
                return item == 0;
              });
              this.yAxis = result ? [] : res[0].data.yAxis;
            } else {
              this.yAxis = res[0].data.yAxis;
            }
            this.xAxis = res[0].data.xAxis;
            this.finished = false;
            this.total = res[1].data.totalCount;
            this.recruitList = res[1].data.list;
          })
          .catch(() => {
            this.yAxis = [];
            this.xAxis = [];
            this.finished = false;
            this.total = 0;
            this.recruitList = [];
          });
      },
      // 列表
      getVipRecruitList() {
        vipRecruitList({
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
          type: this.time_active,
        })
          .then((res) => {
            this.finished = false;
            this.total = res.data.totalCount;
            this.recruitList = res.data.list;
          });
      },
      // 列表上拉加载
      onLoad() {
        if (this.recruitList.length < this.pageSize) {
          this.loading = false;
          this.finished = true;
        } else {
          const { recruitList } = this;
          setTimeout(() => {
            this.pageNumber += 1;
            vipRecruitList({
              pageSize: this.pageSize,
              pageNumber: this.pageNumber,
              type: this.time_active,
            })
              .then((res) => {
                this.loading = false;
                this.total = res.data.totalCount;
                this.recruitList = recruitList.concat(res.data.list);
                if (this.recruitList.length >= res.data.totalCount) {
                  this.finished = true;
                  setTimeout(()=>{
                    this.$toast({
                      message:'没有更多了',
                      duration: 800
                    })
                  },800)
                }
              });
          }, 500);
        }
      },
      // 图表
      getVipRecruitChart() {
        vipRecruitChart({
          type: this.time_active,
        })
          .then((res) => {
            this.yAxis = res.data.yAxis;
            this.xAxis = res.data.xAxis;
          });
      },
      // 图表配置
      drawChart() {
        this.chart = echarts.init(this.$refs.myEchart);
        this.chart.resize();
        // 把配置和数据放这里
        this.chart.setOption({
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          grid: {
            left: '4%',
            right: '2%',
            bottom: '0%',
            top: '6%',
            containLabel: true,
            show: true,
            borderColor: '#fff',
          },
          legend: {
            data: '招募人数',
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
            name: '招募人数',
            type: 'bar',
            barWidth: '60%',
            legendHoverLink: false,
            data: this.yAxis,
          }],
        });
      },

      // 下拉刷新
      onRefresh() {

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


      .time_buttons {
        color: $theme-color;
        height: vw(30);
        line-height: vw(30);
        display: flex;
        border-right: 1px solid $theme-color;

        div {
          flex-grow: 1;
          text-align: center;
          border: 1px solid $theme-color;
          border-right: none;
        }
      }

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

      /*图表*/
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
          font-size: vw(30);
          font-weight: 400;
        }
      }

      .time_active {
        background: $theme-color;
        color: #fff;
      }
    }

    .hong {
      font-size: vw(16);
      color: $hong_color;
    }

    /*表格*/
    .tableBox {
      background: #fff;
      margin-top: vw(8);
      position: relative;
      /*height: vw(330);*/

      .table_header {
        color: $gray_color;
      }

      .table_main {

      }

      table {
        background: #fff;
        width: 100%;
        padding: 0 vw(10);

        td {
          border-bottom: 1px solid $tableBorder;
          text-align: center;
          height: vw(30);
          line-height: vw(30);
          text-overflow: ellipsis;
          vertical-align: middle;

          p {
            height: vw(20);
            line-height: vw(20);
          }
        }

      }
    }
  }

  .money {
    display: inline-block;
    font-size: vw(18);
    width: vw(100);
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
      top: vw(-2);
      right: vw(18);
    }
  }

  .disabled {
    font-size: vw(18);
    color: #000;
  }
</style>
