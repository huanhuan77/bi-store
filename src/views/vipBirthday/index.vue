<template>
  <body>
  <main id="#main">
    <div class="create">
      <div class="create_item">
        <span>生日月份</span>
        <div class="input" @click="handleShowDate">
          <span style="color:#909399">{{date.split('-')[1]}}月</span>
          <van-icon name="arrow"></van-icon>
        </div>
      </div>
    </div>
    <NowStore @closePopup="closePopup" @fiter="fiter"></NowStore>
    <div class="list_header" style="margin-top: 0;padding: 0;">
      <div class="list_box" style="display: flex;align-items: center;padding: 0;border-bottom: none;">
        <MenuButton :typeIndex="typeIndex" :typeList="typeList" @changeType="changeType"></MenuButton>
      </div>
    </div>
    <!--图表-->
    <div class="chartBox" v-show="typeIndex===1" @click="handleChartBox">
      <div :class="className" :id="id" :style="{height:'100',width:'100'}" ref="myEchart1"
           v-show="pieDataShow1"></div>
      <div class="no_data" v-show="!pieDataShow1">暂无数据</div>
    </div>
    <!--图表-->
    <div class="chartBox" v-show="typeIndex===2" @click="handleChartBox">
      <div :class="className" :id="id" :style="{height:'100',width:'100'}" ref="myEchart2"
           v-show="pieDataShow2"></div>
      <div class="no_data" v-show="!pieDataShow2">暂无数据</div>
    </div>
     <!--会员生日年龄段占比-->
    <div class="chartBox" v-show="typeIndex===3" @click="handleChartBox">
      <div :class="className" :id="id" :style="{height:'100',width:'100'}" ref="myEchart3"
           v-show="pieDataShow3"></div>
      <div class="no_data" v-show="!pieDataShow3">暂无数据</div>
    </div>
    <!--会员列表-->
    <van-sticky :offset-top="offsetTop">
      <div class="list_header">
        <div class="list_box">
          <span class="list_name" v-if="vipGrade">{{vipGrade.slice(0,3)}}生日会员列表</span>
          <span class="list_name" v-if="vipSex">生日会员列表({{vipSex.slice(0,1)}})</span>
          <span class="list_name" v-if="state !==''">({{label}})生日会员列表</span>
          <span class="list_name" v-if="vipGrade===''&&vipSex===''&& state===''">生日会员列表</span>
          <span class="list_name">({{total}}人)</span>
        </div>
      </div>
    </van-sticky>
    <div class="mm-content">
      <van-list v-model="loading" :finished="finished" finished-text="" error-text="请求失败，点击重新加载"
                :immediate-check="false" :offset="100"
                @load="onLoad">
        <div class="go_or_down_list" style="margin-top: 0;">
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
import MenuButton from '@/components/menu-button.vue';
import echarts from 'echarts';
import NowStore from '@/components/nowStore.vue';
import { vipPieData, pieVipList } from '@/api/vipAnalysis';
import { formatNum } from '@/utils';

export default {
  name: 'vipBirthday',
  components: {
    MenuButton,
    NowStore,
  },
  data() {
    return {
      showDate: false,
      currentDate: new Date(),
      date: '',
      list: [],
      pieList1: [],
      pieList2: [],
      pieList3: [],
      legend1: [], // 标签
      legend2: [], // 标签
      legend3: [], // 标签
      show: false,
      radioStore: 1,
      storeList: [], // 店铺列表
      offsetTop: 0,
      pageSize: 10,
      pageNumber: 1,
      // status: '', // 所有会员列表
      total: 0,
      vipGrade: '',
      vipSex: '',
      state: '', // 年龄段划分  0 22岁以下  1:22-27岁  2:28-35岁 3:36-45岁  4:45岁以上
      finished: false,
      loading: false,
      isFirstEender: false, // 是否第一次进入
      typeIndex: 1,
      typeList: [
        {
          value: 1,
          name: '生日会员等级',
        },
        {
          value: 2,
          name: '生日会员性别',
        },
        {
          value: 3,
          name: '会员生日年龄段',
        },
      ],
      pieDataShow1: true, // 显示饼图数据
      pieDataShow2: true, // 显示饼图数据
      pieDataShow3: true,
      label: '', // 年龄段名称
      radioStoreName: '',
    };
  },
  created() {
    this.offsetTop = document.getElementsByClassName('headerBox')[0].offsetHeight - 10;
    this.date = new Date().format('yyyy-MM');
    this.radioStore = window.localStorage.getItem('storeNo');
    this.storeList = JSON.parse(window.localStorage.getItem('listStore'));
    this.setStoreName();
    this.getPieData();
    this.getVipList();
    this.isFirstEender = true;
  },
  mounted() {
    const main = document.getElementById('#main');
    main.addEventListener('scroll', this.handleScroll);
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'memberDetail') {
      to.meta.isBack = true;
    }
    next();
  },
  activated() {
    if (!this.$route.meta.isBack || this.isFirstEender) {
      this.setStoreName();
      this.pageNumber = 1;
      this.typeIndex = 1;
      this.total = 0;
      this.vipGrade = '';
      this.vipSex = '';
      this.state = '';
      this.date = new Date().format('yyyy-MM');
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
      this.vipGrade = '';
      this.vipSex = '';
      this.state = '';
      this.pageNumber = 1;
      this.getPieData();
      this.getVipList();
    },
    setCatch() {
      this.pieDataShow1 = false;
      this.pieDataShow2 = false;
      this.pieDataShow3 = false;
      this.pieList1 = [];
      this.legend1 = [];
      this.pieList2 = [];
      this.legend2 = [];
      this.pieList3 = [];
      this.legend3 = [];
      this.loading = false;
      this.finished = false;

      this.list = [];
      this.pageNumber = 1;
      this.total = 0;
      this.vipGrade = '';
      this.vipSex = '';
      this.state = '';
      const chart1 = echarts.init(this.$refs.myEchart1);
      chart1.clear();
      const chart2 = echarts.init(this.$refs.myEchart2);
      chart2.clear();
      const chart3 = echarts.init(this.$refs.myEchart3);
      chart3.clear();
    },
    handleChartBox() {
      this.total = 0;
      this.vipSex = '';
      this.vipGrade = '';
      this.state = '';
      this.pageNumber = 1;
      this.getVipList();
    },
    setStoreName() {
      this.storeList.forEach((item) => {
        if (item.storeNo === this.radioStore) {
          this.radioStoreName = item.storeName;
        }
      });
    },
    changeType(id) {
      if (this.typeIndex === id) return;
      this.typeIndex = id;
      if (id === 3) {
        // 饼图有bug 先清除再加载
        const chart3 = echarts.init(this.$refs.myEchart3);
        chart3.clear();
      }
      this.vipGrade = '';
      this.vipSex = '';
      this.state = '';
      this.pageNumber = 1;
      this.getPieData();
      this.getVipList();
    },
    handleScroll() {
      const main = document.getElementById('#main');
      this.scroll = main.scrollTop;
      this.fixed = this.scroll > this.distanceTop - 40;
    },
    // 饼图数据
    getPieData() {
      vipPieData({
        storeId: this.radioStore,
        dateKey: `${this.date}-01`,
      })
        .then((res) => {
          const data = res.data.vipPieData; // 前2个饼图
          const arr = [];
          arr[0] = data.platinumCardVipCount;
          arr[1] = data.pointCardVipCount;
          arr[2] = data.goldenCardVipCount;
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
          this.pieList1 = arr;
          this.pieList1.forEach((item) => {
            this.legend1.push(item.name);
          });
          this.pieDataShow1 = !(arr[0].value === '' && arr[1].value === '' && arr[2].value === '');
          if (this.pieList1.length !== 0 && this.typeIndex === 1) {
            this.$nextTick(() => {
              this.drawChart1();
            });
          }

          const brr = [];
          brr[0] = data.womanlVipCount;
          brr[1] = data.manVipCount;
          brr.forEach((item, index) => {
            const obj = {};
            if (item.split(',')[1] == 0) {
              // 设置为空就不显示文本标签
              this.$set(obj, 'value', '');
            } else {
              this.$set(obj, 'value', item.split(',')[1]);
            }
            this.$set(obj, 'name', item.split(',')[0]);
            brr[index] = obj;
          });
          this.pieList2 = brr;
          this.pieList2.forEach((item) => {
            this.legend2.push(item.name);
          });
          this.pieDataShow2 = !(brr[0].value === '' && brr[1].value === '');
          if (this.pieList2.length !== 0 && this.typeIndex === 2) {
            this.$nextTick(() => {
              this.drawChart2();
            });
          }

          // 会员生日年龄段占比
          const pie3Data = res.data.dataList;
          if (pie3Data.length !== 0) {
            // 数据为0  标签不显示
            pie3Data.forEach((item) => {
              if (item.value === 0) {
                item.value = '';
              }
              this.legend3.push(item.name);
            });
            // 判断是否全部的数据都为0  如果为0 赋值为空
            const isNull = pie3Data.every(item => item.value == '');
            if (!isNull) {
              this.pieList3 = pie3Data;
              this.pieDataShow3 = true;
              this.$nextTick(() => {
                this.drawChart3();
              });
            } else {
              this.pieList3 = [];
              this.pieDataShow3 = false;
            }
          } else {
            this.pieList3 = [];
            this.pieDataShow3 = false;
          }
        })
        .catch(() => {
          this.setCatch();
        });
    },

    // 会员列表
    getVipList() {
      pieVipList({
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        storeId: this.radioStore,
        dateKey: `${this.date}-01`,
        vipGrade: this.vipGrade,
        vipSex: this.vipSex,
        status: this.state,
      })
        .then(({ data }) => {
          this.list = data.pieVipList;
          this.total = data.totalCount;
          this.loading = false;
          this.finished = false;
        })
        .catch(() => {
          this.setCatch();
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
      this.showDate = false;
      if (this.date === value.format('yyyy-MM')) return;
      this.vipGrade = '';
      this.vipSex = '';
      this.state = '';
      this.date = value.format('yyyy-MM');
      this.pageNumber = 1;
      this.typeIndex = 1;
      this.getPieData();
      this.getVipList();
    },
    drawChart1() {
      // 会员等级
      const chart = echarts.init(this.$refs.myEchart1);
      chart.resize();
      chart.clear();
      // 把配置和数据放这里
      chart.setOption(
        {
          tooltip: {
            trigger: 'item',
            // formatter: '{a} <br/>{b} : {c} ({d}%)',
            // 百分比保留整数  数据设置千分位
            formatter(data) {
              return `${data.seriesName}<br>${data.name}:${formatNum(data.value)}(${data.percent.toFixed(0)}%)`;
            },
            confine: true,
          },
          legend: {
            selectedMode: false, // 取消图例上的点击事件
            orient: 'horizontal',
            top: 'top',
            data: this.legend1,
          },
          series: [
            {
              name: '比例',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: this.pieList1,
              label: {
                fontSize: 16,
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
                    fontSize: 13,
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
        },
      );
      // 重置点击事件
      chart.off('click');
      // 点击饼图事件
      chart.on('click', (param) => {
        this.total = 0;
        this.vipSex = '';
        this.pageNumber = 1;
        this.finished = false;
        const label = param.data.name;
        this.vipGrade = label.slice(0, 3);
        this.getVipList();
      });
    },
    drawChart2() {
      // 会员等级
      const chart = echarts.init(this.$refs.myEchart2);
      chart.resize();
      chart.clear();
      // 把配置和数据放这里
      chart.setOption(
        {
          tooltip: {
            trigger: 'item',
            // formatter: '{a} <br/>{b} : {c} ({d}%)',
            // 百分比保留整数  数据设置千分位
            formatter(data) {
              return `${data.seriesName}<br>${data.name}:${formatNum(data.value)}(${data.percent.toFixed(0)}%)`;
            },
            confine: true,
          },
          legend: {
            selectedMode: false, // 取消图例上的点击事件
            orient: 'horizontal',
            top: 'top',
            data: this.legend2,
          },
          series: [
            {
              name: '比例',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: this.pieList2,
              label: {
                fontSize: 16,
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
                    fontSize: 13,
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
        },
      );
      // 重置点击事件
      chart.off('click');
      // 注释的功能，是判断点击折线图的拐点。
      chart.on('click', (param) => {
        this.vipGrade = '';
        this.pageNumber = 1;
        this.finished = false;
        const label = param.data.name;
        this.vipSex = label.slice(0, 1);
        this.getVipList();
      });
    },

    // 会员生日年龄段占比
    drawChart3() {
      const chart = echarts.init(this.$refs.myEchart3);
      chart.resize();
      chart.clear();
      // 把配置和数据放这里
      chart.setOption(
        {
          tooltip: {
            trigger: 'item',
            // formatter: '{a} <br/>{b} : {c} ({d}%)',
            // 百分比保留整数  数据设置千分位
            formatter(data) {
              return `${data.seriesName}<br>${data.name}:${formatNum(data.value)}(${data.percent.toFixed(0)}%)`;
            },
            confine: true,
          },
          legend: {
            selectedMode: false, // 取消图例上的点击事件
            orient: 'horizontal',
            top: 'top',
            data: this.legend3,
          },
          series: [
            {
              name: '比例',
              type: 'pie',
              radius: '55%',
              center: ['50%', '65%'],
              data: this.pieList3,
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
        },
      );
      // 重置点击事件
      chart.off('click');
      // 点击饼图事件
      chart.on('click', (param) => {
        this.total = 0;
        this.vipSex = '';
        this.vipGrade = '';
        this.state = '';
        this.pageNumber = 1;
        this.finished = false;
        this.label = param.data.name;
        switch (this.label) {
          case '20-27岁':
            this.state = 1;
            break;
          case '28-35岁':
            this.state = 2;
            break;
          case '36-45岁':
            this.state = 3;
            break;
          case '45岁以上':
            this.state = 4;
            break;
          case '20岁以下':
            this.state = 5;
            break;
          default:
            this.state = '';
        }
        this.getVipList();
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
      const chart1 = echarts.init(this.$refs.myEchart1);
      chart1.dispatchAction({
        type: 'hideTip',
      });
      const chart2 = echarts.init(this.$refs.myEchart2);
      chart2.dispatchAction({
        type: 'hideTip',
      });
      const chart3 = echarts.init(this.$refs.myEchart3);
      chart3.dispatchAction({
        type: 'hideTip',
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
      this.getPieData();
      this.getVipList();
    },
    sure() {
      this.setStoreName();
      this.show = false;
      this.vipGrade = '';
      this.vipSex = '';
      this.state = '';
      // this.typeIndex = 1;
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
          pieVipList({
            pageSize: this.pageSize,
            pageNumber: this.pageNumber,
            storeId: this.radioStore,
            dateKey: `${this.date}-01`,
            vipGrade: this.vipGrade,
            vipSex: this.vipSex,
            status: this.state,
          })
            .then(({ data }) => {
              this.loading = false;
              this.total = data.totalCount;
              this.list = list.concat(data.pieVipList);
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
  },
  props: {
    className: {
      type: String,
      default:
          'chart',
    },
    id: {
      type: String,
      default:
          'yourID',
    },
  },
};
</script>

<style lang="scss">
  @import "@/assets/style/work-public.scss";
  @import '@/assets/style/member-public.scss';

  .chartBox {
    width: 100%;
    height: vw(200);
    line-height: vw(200);
    text-align: center;
    font-size: vw(30);
    background: #fff;
    color: #ddd;

    .chart {
      width: 100%;
      padding: vw(6);
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

  /*.storeName {*/
  /*  width: vw(200);*/
  /*  overflow: hidden;*/
  /*  text-overflow: ellipsis;*/
  /*  white-space: nowrap;*/
  /*}*/

  .list_box {
    position: relative;

    .allData {
      display: inline-block;
      height: 100%;
      margin: 0 vw(8);
      position: absolute;
      top: 50%;
      right: vw(10);
      transform: translateY(-50%);
      color: $theme-color;
    }
  }

</style>
