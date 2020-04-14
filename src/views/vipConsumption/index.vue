<template>
  <body>
  <main id="#main">
    <div class="create">
      <div class="create_item">
        <span>招募月份</span>
        <div class="input" @click="handleShowDate">
          <span style="color:#909399">{{date}}</span>
          <van-icon name="arrow"></van-icon>
        </div>
      </div>
      <NowStore @closePopup="closePopup" @fiter="fiter"></NowStore>
      <div class="rangeBox" style="margin-top: 0;">
        <div style="text-align: center">
          <yd-countup
            :endnum="consume.nowRecruit||0"
            startnum="0"
            class="number"
            :duration="1"
            separator="," style="color: #4F77AA"
            @click.native="toEmpDetail">
          </yd-countup>
          <p>本期招募人数</p>
        </div>
        <div style="text-align: center">
          <yd-countup :endnum="consume.lastRecruit||0" startnum="0" class="number" :duration="1"
                      separator=","></yd-countup>
          <p>上期招募人数</p>
        </div>
        <div style="text-align: center">
          <yd-countup :endnum="consume.percentageComplete||0" startnum="0" class="number" :duration="1"
                      separator="," suffix="%"></yd-countup>
          <p>指标完成率</p>
        </div>
      </div>
    </div>
    <div class="chartBox" v-show="pieDataShow" @click="handleChartBox">
      <div :id="id" :class="className"  style="height: 100%;width:100%" ref="myEchart"></div>
    </div>
    <div class="_remark" v-show="pieDataShow" style="color: #d70d17;font-size: 13px;">注意：有{{unConsumeNum}}人发生了消费，但未招募为会员</div>
    <div class="chart_nodata_box" v-show="!pieDataShow">
      <p class="_title">消费人数占比</p>
      <p class="_noData"> 暂无数据</p>
    </div>

    <!--会员列表-->
    <van-sticky :offset-top="offsetTop">
      <div class="list_header">
        <div class="list_box">
          <span class="list_name" v-if="status===1">老会员消费列表</span>
          <span class="list_name" v-if="status===2">新会员消费列表</span>
          <span class="list_name" v-if="status===4||status===3">消费会员列表</span>
          <span class="list_name">({{total}}人)</span>
        </div>
      </div>
    </van-sticky>

    <div class="mm-content">
      <van-list v-model="loading" :finished="finished" finished-text="" error-text="请求失败，点击重新加载"
                :immediate-check="false" :offset="100"
                @load="onLoad">
        <div class="go_or_down_list" style="margin-top: 0;" v-if="!isNoVip">
          <template v-if="list.length!==0">
            <div class="list_main">
              <div class="list_item" v-for="(vip,index) in list"
                   :key="index" @click="vipDetail(vip.vipMobile)">
                <div class="img">
                  <img
                    v-if="vip.vipGrade==='积分卡'"
                    style="height: 100%;width: 100%"
                    src="@/assets/image/1-1.jpg"
                  />
                  <img
                    v-else-if="vip.vipGrade==='黄金卡'"
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
                  <p><span>手机号：</span><span>{{vip.vipMobile}}</span></p>
                  <p><span>会员级别：</span><span>{{vip.vipGrade}}</span></p>
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
    v-model="showDate"
    position="bottom">
    <van-datetime-picker
      v-model="currentDate"
      type="year-month"
      :formatter="formatter"
      @cancel="cancel"
      @confirm="confirm">
    </van-datetime-picker>
  </van-popup>

  </body>
</template>

<script>
import echarts from 'echarts';
import { salseCustomerPieData, salseVipList, recruitCollect } from '@/api/vipAnalysis';
import NowStore from '@/components/nowStore.vue';
import { formatNum } from '@/utils';

export default {
  name: 'vipConsumption',
  components: {
    NowStore,
  },
  data() {
    return {
      showDate: false,
      currentDate: new Date(),
      date: '',
      list: [],
      pieList: [],
      show: false,
      legend: [], // 标签
      radioStore: 1,
      storeList: [], // 店铺列表
      offsetTop: 0,
      pageSize: 10,
      pageNumber: 1,
      status: 4, // 所有会员列表
      total: 0,
      isFirstEender: false, // 是否第一次进入
      finished: false,
      loading: false,
      pieDataShow: true, // 显示饼图数据
      radioStoreName: '',
      isNoVip: false,
      consume: {
        nowRecruit: 0,
        lastRecruit: 0,
        percentageComplete: 0,
      },
      unConsumeNum: 0, // 未招募人数
    };
  },
  created() {
    this.offsetTop = document.getElementsByClassName('headerBox')[0].offsetHeight - 10;
    this.date = new Date().format('yyyy-MM');
    this.radioStore = window.localStorage.getItem('storeNo');
    this.storeList = JSON.parse(window.localStorage.getItem('listStore'));
    this.setStoreName();
    this.getRecruitCollect();
    this.getPieData();
    this.getVipList();
  },
  mounted() {
    const main = document.getElementById('#main');
    main.addEventListener('scroll', this.handleScroll);
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'memberDetail' || from.name === 'currentVipConsumption') {
      to.meta.isBack = true;
    }
    next();
  },
  activated() {
    if (!this.$route.meta.isBack || this.isFirstEender) {
      this.pageNumber = 1;
      this.total = 0;
      this.status = 4;
      this.date = new Date().format('yyyy-MM');
      this.setStoreName();
      this.getRecruitCollect();
      this.getPieData();
      this.getVipList();
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
      this.pageNumber = 1;
      this.getRecruitCollect();
      this.getPieData();
      this.getVipList();
    },
    setCatch() {
      this.pieDataShow = false;
      this.pieList = [];
      this.legend = [];
      this.loading = false;
      this.finished = false;
      this.status = 4;
      this.list = [];
      this.total = 0;
      const chart = echarts.init(this.$refs.myEchart);
      chart.clear();
    },
    handleChartBox() {
      this.total = 0;
      this.pageNumber = 1;
      this.status = 4;
      this.getVipList();
    },
    setStoreName() {
      this.storeList.forEach((item) => {
        if (item.storeNo === this.radioStore) {
          this.radioStoreName = item.storeName;
        }
      });
    },
    handleScroll() {
      const main = document.getElementById('#main');
      this.scroll = main.scrollTop;
      this.fixed = this.scroll > this.distanceTop - 40;
    },
    // 会员招募汇总
    getRecruitCollect() {
      recruitCollect({
        dateKey: `${this.date}-01`,
      })
        .then(({ data }) => {
          if (data === null) {
            this.consume = {
              nowRecruit: 0,
              lastRecruit: 0,
              percentageComplete: 0,
            };
          } else {
            this.consume = data;
          }
        })
        .catch(() => {
          this.consume = {
            nowRecruit: 0,
            lastRecruit: 0,
            percentageComplete: 0,
          };
        });
    },
    // 饼图数据
    getPieData() {
      salseCustomerPieData({
        storeId: this.radioStore,
        dateKey: `${this.date}-01`,
      })
        .then(({ data }) => {
          const arr = [];
          arr[0] = data.notVipCount;
          arr[1] = data.oldVipCount;
          arr[2] = data.recruitVipCount;
          arr.forEach((item, index) => {
            const obj = {};
            if (item.split(',')[1] == 0) {
              // 设置为空就不显示文本标签
              this.$set(obj, 'value', '');
            } else {
              this.$set(obj, 'value', item.split(',')[1]);
            }
            this.$set(obj, 'name', item.split(',')[0]);
            arr[index] = obj;
          });
          this.pieDataShow = !(arr[0].value === '' && arr[1].value === '' && arr[2].value === '');
          this.pieList = arr;
          this.unConsumeNum = this.pieList[0].value; // 未招募会员
          this.pieList.forEach((item) => {
            this.legend.push(item.name);
          });
          if (this.pieList.length === 0) return;
          this.$nextTick(() => {
            this.drawChart();
          });
        })
        .catch(() => {
          this.setCatch();
        });
    },
    // 会员列表
    getVipList() {
      salseVipList({
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        storeId: this.radioStore,
        dateKey: `${this.date}-01`,
        status: this.status, // 1老会员消费人数、2新会员消费人数、‘’全部会员
      })
        .then(({ data }) => {
          if (data !== null) {
            this.list = data.salseVipList;
            this.total = data.totalCount;
          } else {
            this.list = [];
          }
          this.loading = false;
          this.finished = false;
        });
    },
    handleShowDate() {
      this.showDate = true;
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
    cancel() {
      this.showDate = false;
    },
    confirm(value) {
      this.pageNumber = 1;
      this.showDate = false;
      if (this.date === value.format('yyyy-MM')) return;
      this.status = 4;
      this.date = value.format('yyyy-MM');
      this.getRecruitCollect();
      this.getPieData();
      this.getVipList();
    },
    drawChart() {
      const chart = echarts.init(this.$refs.myEchart);
      chart.resize();
      chart.clear();
      // 把配置和数据放这里
      chart.setOption(
        {
          tooltip: {
            trigger: 'item',
            // // 百分比只保留整数
            // formatter: '{a} <br/>{b} : {c} ({d}%)',
            formatter(data) {
              return `${data.seriesName}<br>${data.name}:${formatNum(data.value)}(${data.percent.toFixed(0)}%)`;
            },
            confine: true,
          },
          title: {
            text: '消费人数占比',
            textStyle: {
              fontSize: 15,
            },
          },
          legend: {
            selectedMode: false, // 取消图例上的点击事件
            orient: 'horizontal',
            top: '25px',
            left: '30px',
            data: this.legend,
          },
          series: [
            {
              name: '比例',
              type: 'pie',
              radius: '45%',
              center: ['50%', '70%'],
              data: this.pieList,
              label: {
                fontSize: 13,
                normal: {
                  textStyle: {
                    fontSize: 12,
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
        }, true,
      );
      // 重置点击事件
      chart.off('click');
      // 注释的功能，是判断点击折线图的拐点。
      chart.on('click', (param) => {
        this.total = 0;
        const label = param.data.name;
        // console.log(label)
        if (label === '老会员消费人数') {
          this.status = 1;
          this.pageNumber = 1;
          this.getVipList();
        } else if (label === '新会员消费人数') {
          this.status = 2;
          this.pageNumber = 1;
          this.getVipList();
        } else {
          this.pageNumber = 1;
          this.status = 3;
          this.getVipList();
        }
      });
    },
    vipDetail(vipMobile) {
      this.$router.push({
        name: 'memberDetail',
        query: {
          vipMobile,
          show: false,
          myMember: false,
        },
      });
    },
    fiter() {
      const chart = echarts.init(this.$refs.myEchart);
      chart.dispatchAction({
        type: 'hideTip',
      });
      // this.show = true;
    },
    close() {
      this.sure();
    },
    reset() {
      // 重置店铺
      this.radioStore = JSON.parse(window.localStorage.getItem('listStore'))[0].storeNo;
      window.localStorage.setItem('storeNo', this.radioStore);
      this.getPieData();
      this.getVipList();
    },
    sure() {
      this.setStoreName();
      this.show = false;
      this.status = 4;
      window.localStorage.setItem('storeNo', this.radioStore);
      this.getPieData();
      this.getVipList();
    },
    // 上拉加载
    onLoad() {
      if (this.list.length < this.pageSize) {
        this.loading = false;
        this.finished = true;
      } else {
        const { list } = this;
        setTimeout(() => {
          this.pageNumber += 1;
          salseVipList({
            pageSize: this.pageSize,
            pageNumber: this.pageNumber,
            storeId: this.radioStore,
            dateKey: `${this.date}-01`,
            status: this.status, // 1老会员、2招募会员、‘’全部会员
          })
            .then(({ data }) => {
              this.loading = false;
              this.total = data.totalCount;
              this.list = list.concat(data.salseVipList);
              if (this.list.length >= data.totalCount) {
                this.finished = true;
                setTimeout(() => {
                  this.$toast({
                    message: '没有更多了',
                  });
                }, 1000);
              }
            });
        }, 500);
      }
    },
    toEmpDetail() {
      if (this.consume.nowRecruit == 0) return;
      this.$router.push({ name: 'currentVipConsumption', query: { dateKey: this.date, state: this.status } });
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

<style lang="scss">
  @import "@/assets/style/work-public.scss";
  @import '@/assets/style/member-public.scss';

  .rangeBox {
    padding: 0 vw(10);
    height: vw(70);
    background: #fff;
    margin-top: vw(8);
    display: flex;
    position: relative;
    justify-content: space-around;
    margin-bottom: vw(8);

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

  .chartBox {
    width: 100%;
    height: vw(230);
    line-height: vw(230);
    text-align: center;
    font-size: vw(30);
    background: #fff;
    color: #ddd;
    padding: vw(5);
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
  ._remark{
    height: vw(30);
    line-height: vw(30);
    background: #fff;
    font-size: vw(12);
    padding-left: vw(15);
  }
</style>
