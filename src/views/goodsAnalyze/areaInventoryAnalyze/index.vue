<template>
  <body class="rank">
  <NowStore @closePopup="closeStorePopup"></NowStore>

  <!-- 商品品牌-->
  <div class="brand_box">
    <span class="brand">商品品牌：</span>
    <yd-checkbox-group v-model="productBrand" size="17" color="#4F77AA" :callback="changeBrand">
      <yd-checkbox
        v-for="(item,index) in brandList"
        :val="item"
        :key="index"
      ></yd-checkbox>
    </yd-checkbox-group>

    <!-- 筛选-->
    <div
      :class="productCategory.length ==0 && productYear.length==0 &&
       productMonth.length==0?'color_theme':'color_red fw'"
      class="brand_fiter"
      @click="openFiter">
      <span>筛选</span>
      <i class="iconfont icon-shaixuan icon"></i>
    </div>
  </div>

  <main id="main">
    <!--柱状图-->
    <div class="chart_box" v-show="yAxis.length !==0">
      <div id="myEchart" class="chart" :style="{height:'100',width:'100'}" ref="myEchart"
           @click="handleChartBox"></div>
    </div>

    <div class="chart_nodata_box" v-show="yAxis.length  ===0">
      <p class="_title">库存分析</p>
      <p class="_noData"> 暂无数据</p>
    </div>

    <!--    说明-->
    <div class="remark">
      <p>指标说明</p>
      <p style="padding-left: 30px">在库数：目前在店铺的库存数量</p>
      <p style="padding-left: 30px">在途数：总部发货，店铺未收货数量</p>
      <p style="padding-left: 30px">欠数：订单未发货数</p>
      <p style="padding-left: 30px">金额单位默认为：元</p>
    </div>
    <div class="table" style="margin: 10px 0">
      <table border="0" cellspacing="0" cellpadding="0" rules="groups">
        <tbody>
        <tr>
          <td class="table_border_right"></td>
          <td colspan="3" class="table_border_right table_color_gray">在库</td>
          <td colspan="2" class="table_border_right table_color_gray">在途</td>
          <td colspan="2" class="table_color_gray">订单欠数</td>
        </tr>
        <tr>
          <td width="10%" class="table_border_right table_color_gray">大类</td>
          <td width="10%" class="table_color_gray table_border_right">数量</td>
          <td width="10%" class="table_color_gray table_border_right">金额</td>
          <td width="10%" class="table_border_right table_color_gray">占比</td>
          <td width="10%" class="table_color_gray table_border_right">数量</td>
          <td width="10%" class="table_border_right table_color_gray">金额</td>
          <td width="10%" class="table_color_gray table_border_right">数量</td>
          <td width="10%" class="table_color_gray table_border_right">
            <p>标准</p>
            <p>金额</p>
          </td>
        </tr>
        <tr>
          <td width="10%" class="table_border_right  fw">合计</td>
          <td width="10%" class="fw table_border_right">{{sum.inQty|formatAmount}}</td>
          <td width="10%" class="fw table_border_right">{{sum.inAmount|formatAmount}}</td>
          <td width="10%" class="table_border_right  fw"></td>
          <td width="10%" class="fw table_border_right">{{sum.onQty|formatAmount}}</td>
          <td width="10%" class="table_border_right fw">{{sum.onAmount|formatAmount}}</td>
          <td width="10%" class="fw table_border_right">{{sum.oweQty|formatAmount}}</td>
          <td width="10%" class="fw">{{sum.oweAmount|formatAmount}}</td>
        </tr>
        <template v-if="stockAnalyze.length !==0">
          <tr v-for="(item,index) in stockAnalyze" :key="index">
            <td width="10%" class="color_theme table_border_right"
                @click="toDetail(item.ProductOldCategory)">
              {{item.ProductOldCategory}}
            </td>
            <td width="10%" class="table_border_right">{{item.inQty|formatAmount}}</td>       <!-- 在库数量-->
            <td width="10%" class="table_border_right">{{Math.round(item.inAmount) |formatAmount}}</td>  <!-- 在库金额-->
            <td width="10%" class="table_border_right">{{item.amountRatio|formatPercent}}%</td>
            <!-- 在库金额占比-->
            <td width="10%" class="table_border_right">{{item.onQty|formatAmount}}</td> <!-- 在途数量-->
            <td width="10%" class="table_border_right">{{Math.round(item.onAmount)|formatAmount}}
            </td> <!-- 在途金额-->
            <td width="10%" class="table_border_right">{{item.oweQty|formatAmount}}</td> <!-- 欠数数量-->
            <td width="10%">{{Math.round(item.oweAmount)|formatAmount}}</td><!-- 欠数金额-->
          </tr>
        </template>

        <tr v-else>
          <td colspan="8" class="noData">暂无数据</td>
        </tr>
        </tbody>
      </table>
    </div>

  </main>

  <!--筛选弹框-->
  <van-popup
    class="rank_fiter"
    v-model="showFiterPopup"
    @close="closeFiterPopup"
    position="right"
    close-on-popstate
    style="width: 70%;height: 100%">
    <div class="box">
      <van-cell title="请选择筛选条件" style="background:#f4f4f4 "/>
      <div class="main">
        <van-collapse v-model="collapseName">
          <van-collapse-item title="商品年份" name="1" :value="`已选择${productYear.length}个`">
            <van-button size="small" @click="selectAll('year')"
                        v-if="productYear.length !==yearList.length">全选
            </van-button>
            <van-button size="small" @click="cancelAll('year')" v-else>取消</van-button>
            <div class="flex_collapse">
              <van-button
                size="small"
                @click="select('year',item)"
                v-for="(item,index) in  showYearList"
                :key="index"
                :class="productYear.includes(item)?'select_btn':''"
                :icon="productYear.includes(item)?'success' :''"
              >{{item}}
              </van-button>

              <van-button @click="changeFold('year')" size="small">{{yearFold?'更多':'收起'}}
              </van-button>
            </div>
          </van-collapse-item>

          <van-collapse-item title="商品月份" name="2" :value="`已选择${productMonth.length}个`">
            <van-button size="small" @click="selectAll('month')"
                        v-if="productMonth.length !==monthList.length">全选
            </van-button>
            <van-button size="small" @click="cancelAll('month')" v-else>取消</van-button>
            <div class="flex_collapse">
              <van-button
                size="small"
                v-for="(item,index) in  showMonthList"
                @click="select('month',item)"
                :key="index"
                :class="productMonth.includes(item)?'select_btn':''"
                :icon="productMonth.includes(item)?'success' :''"
              >{{item}}
              </van-button>
              <van-button @click="changeFold('month')" size="small">{{monthFold?'更多':'收起'}}
              </van-button>
            </div>
          </van-collapse-item>
          <van-collapse-item title="商品大类" name="3" :value="`已选择${productCategory.length}个`">
            <div class="_input">
              <input v-model="category"/>
              <van-icon name="close" size="20" v-show="category" @click="category=''"/>
            </div>
            <div class="category_search" @click="searchCategory">查询</div>

            <div v-show="categoryList.length !==0">
              <van-button size="small" @click="selectAll('category')"
                          v-if="(productCategory.length !==categoryList.length)">
                全选
              </van-button>
              <van-button size="small" @click="cancelAll('category')" v-else>取消</van-button>
            </div>

            <div class="flex_collapse">
              <van-button
                size="small"
                v-for="(item,index) in  showCategoryList"
                @click="select('category',item)"
                :key="index"
                :class="productCategory.includes(item)?'select_btn':''"
                :icon="productCategory.includes(item)?'success' :''"
              >{{item}}
              </van-button>
              <van-button @click="changeFold('category')" size="small"
                          v-show="categoryList.length !==0">{{categoryFold?'更多':'收起'}}
              </van-button>
              <div class="category_nodata" v-show="categoryList.length ===0">没有匹配的大类!</div>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
      <div class="bottom">
        <van-button size="small" id="reset" @click="reset">重置</van-button>
        <van-button type="info" size="small " @click="sure">确定</van-button>
      </div>
    </div>
  </van-popup>
  </body>
</template>

<script>
import NowStore from '@/components/nowStore.vue';
import * as stock from '@/api/goodsAnalyze';
import echarts from 'echarts';
import { formatNum } from '@/utils';

let index = ''; // 柱状图下标
export default {
  name: 'areaInventoryAnalyze',
  components: {
    NowStore,
  },
  data() {
    return {
      brandList: [],
      productBrand: [],
      collapseName: ['1', '2', '3'], // 筛选折叠面板
      // 筛选
      categoryList: [],
      productCategory: [],
      category: '',
      categoryFold: true,
      productYear: [], // 年份
      yearList: [],
      yearFold: true,
      productMonth: [], // 月份
      monthList: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      monthFold: true,
      showFiterPopup: false,
      status: '', // 1：3个月内  2：4-6个月   3：7-9个月   4：9个月以上
      // 合计
      sum: {
        inAmount: 0,
        inQty: 0,
        onAmount: 0,
        onQty: 0,
        oweAmount: 0,
        oweQty: 0,
      },
      yAxis: [],
      xAxis: [],
      stockAnalyze: [],
      isFirstEnter: false, // 是否第一次进入，默认false
      scroll: '',
    };
  },
  created() {
    this.isFirstEnter = true;
    const y = new Date().getFullYear(); // 年份
    // this.productYear = y;
    this.yearList = [y, y - 1, y - 2, y - 3, y - 4, y - 5, y - 6, y - 7, y - 8, y - 9, y - 10, y - 11, y - 12, y - 13, y - 14]; // 过去15年
    // const m = new Date().getMonth() + 1; // 当月
    // this.productMonth = m < 10 ? `0${m}` : m.toString();
    // this.getInfo();
    this.getConditionList();
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == 'areaInventoryAnalyzeDetail') {
      to.meta.isBack = true;
    }
    next();
  },
  activated() {
    // 如果不是返回 且  不是第一次进来
    if (!this.$route.meta.isBack && !this.isFirstEnter) {
      const y = new Date().getFullYear(); // 年份
      this.yearList = [y, y - 1, y - 2, y - 3, y - 4, y - 5, y - 6, y - 7, y - 8, y - 9, y - 10, y - 11, y - 12, y - 13, y - 14]; // 过去15年
      // 清空数据
      this.productYear = [];
      this.productMonth = [];
      this.productCategory = [];
      this.productBrand = [];
      this.category = '';
      this.yAxis = [];
      this.xAxis = [];
      this.stockAnalyze = [];
      this.status = '';
      index = '';
      this.getConditionList();
    }
    this.$route.meta.isBack = false;
    this.isFirstEnter = false;

    const main = document.getElementById('main');
    if (this.scroll > 0) {
      main.scrollTo(0, this.scroll);
      this.scroll = 0;
      main.addEventListener('scroll', this.handleScroll());
    }
  },
  updated() {
    // this.drawChart();
  },
  mounted() {
    // ios
    document.body.addEventListener('focusout', () => {
      window.scroll(0, 0);// 失焦后强制让页面归位即可
    });

    const main = document.getElementById('main');
    main.addEventListener('scroll', this.handleScroll);
  },
  watch: {
    category(val) {
      if (val) {
        this.categoryList = this.fiterCategory(this.categoryList, val);
      } else {
        stock.conditionList()
          .then(({ data }) => {
            this.brandList = data.productBrandList;
            this.productBrand = [];
            this.$nextTick(() => {
              data.productBrandList.forEach((item) => {
                this.productBrand.push(item);
              });
            });
            this.categoryList = data.productCategoryList;
          });
      }
    },
  },
  computed: {
    showYearList: {
      get() {
        if (this.yearFold) {
          if (this.yearList.length < 4) {
            return this.yearList;
          }
          const newArr = [];
          for (let i = 0; i < 4; i++) {
            const item = this.yearList[i];
            newArr.push(item);
          }
          return newArr;
        }
        return this.yearList;
      },
      set(val) {
        this.showYearList = val;
      },
    },

    showMonthList: {
      get() {
        if (this.monthFold) {
          if (this.monthList.length < 4) {
            return this.monthList;
          }
          const newArr = [];
          for (let i = 0; i < 4; i++) {
            const item = this.monthList[i];
            newArr.push(item);
          }
          return newArr;
        }
        return this.monthList;
      },
      set(val) {
        this.showMonthList = val;
      },
    },
    showCategoryList: {
      get() {
        if (this.categoryFold) {
          if (this.categoryList.length < 4) {
            return this.categoryList;
          }
          const newArr = [];
          for (let i = 0; i < 4; i++) {
            const item = this.categoryList[i];
            newArr.push(item);
          }
          return newArr;
        }
        return this.categoryList;
      },
      set(val) {
        this.showCategoryList = val;
      },
    },
  },
  methods: {
    handleScroll() {
      const main = document.getElementById('main');
      this.scroll = main.scrollTop;
    },
    // 品牌
    getConditionList() {
      stock.conditionList()
        .then(({ data }) => {
          this.brandList = data.productBrandList;
          this.$nextTick(() => {
            data.productBrandList.forEach((item) => {
              this.productBrand.push(item);
            });
          });
          this.categoryList = data.productCategoryList;
          this.$dialog.loading.open('加载中');
          this.getPieData();
          this.getInfo();
        });
    },
    // 柱状图
    getPieData() {
      stock.stockAnalyzePie({
        productCategoryList: this.productCategory,
        productBrandList: this.productBrand,
      })
        .then(({ data }) => {
          this.yAxis = data.yAxis;
          this.xAxis = data.xAxis;
          this.$nextTick(() => {
            this.drawChart();
          });
        });
    },
    // 表格
    getInfo() {
      stock.stockAnalyze({
        productCategoryList: this.productCategory,
        productYear: this.productYear,
        productMonth: this.productMonth,
        productBrandList: this.productBrand,
        status: this.status,
      })
        .then(({ data }) => {
          this.$dialog.loading.close();
          this.stockAnalyze = data;
          // 在库金额
          this.sum.inAmount = data.reduce((total, curr) => total + Math.round(curr.inAmount), 0);
          // 在库数量
          this.sum.inQty = data.reduce((total, curr) => total + curr.inQty, 0);
          // 在途数量
          this.sum.onQty = data.reduce((total, curr) => total + curr.onQty, 0);
          // 在途金额
          this.sum.onAmount = data.reduce((total, curr) => total + Math.round(curr.onAmount), 0);
          // 欠数数量
          this.sum.oweQty = data.reduce((total, curr) => total + curr.oweQty, 0);
          // 欠数金额
          this.sum.oweAmount = data.reduce((total, curr) => total + Math.round(curr.oweAmount), 0);
        })
        .catch(() => {
          this.$dialog.loading.close();
          this.clearData();
        });
    },
    clearData() {
      this.yAxis = [];
      this.xAxis = [];
      this.stockAnalyze = [];
      this.status = '';
      this.sum = {
        inAmount: 0,
        inQty: 0,
        onAmount: 0,
        onQty: 0,
        oweAmount: 0,
        oweQty: 0,
      };
      const chart = echarts.init(document.getElementById('myEchart'));
      chart.resize();
    },
    closeStorePopup() {
      this.status = '';
      this.getPieData();
      this.getInfo();
    },
    // 品牌
    changeBrand(val) {
      this.status = '';
      this.productBrand = val;
      this.getPieData();
      this.getInfo();
    },
    // 柱状图
    drawChart() {
      const chart = echarts.init(document.getElementById('myEchart'));
      chart.clear();
      chart.resize();

      // 把配置和数据放这里
      const option = {
        title: {
          text: '库存分析',
          textStyle: {
            fontSize: 15,
          },
        },
        animation: false,
        tooltip: {
          trigger: 'item',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line', // 默认为直线，可选为：'line' | 'shadow'
            confine: true,
          },
          // formatter: '{b}:\n{c}',
          formatter(data) {
            return `${data.name}:${formatNum(data.value)}`;
          },
        },
        legend: {
          data: ['在库数量'],
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
          data: this.xAxis,
          triggerEvent: true,
          axisLabel: {
            fontSize: 13,
            interval: 0, // 强制显示所有标签
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
          {
            name: '在库数量',
            type: 'bar',
            barWidth: '40%',
            data: this.yAxis,
            itemStyle: {
              normal: {
                // color: '#61a0a8',
                // 添加单击选中颜色
                color(params) {
                  const key = params.dataIndex;
                  if (key === index) {
                    return '#14A89B';
                  }
                  return '#61a0a8';
                },
                label: {
                  show: true, // 开启显示
                  position: 'top', // 在上方显示
                  textStyle: { // 数值样式
                    color: 'black',
                    fontSize: 11,
                  },
                },
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                // color: '#14A89B',
              },
            },
          },
        ],
      };
      chart.setOption(option, false);
      // 重置点击事件
      chart.off('click');
      // 点击柱状图事件
      chart.on('click', (param) => {
        let label = ''; // 标签名称
        // 判断点击的是柱状还是横坐标
        param.name ? label = param.name : label = param.value;
        // param.dataIndex ? index = param.dataIndex : index = param.componentIndex;
        switch (label) {
          case '3个月内':
            this.status = 1;
            index = 0;
            break;
          case '4-6个月':
            this.status = 2;
            index = 1;
            break;
          case '7-9个月':
            this.status = 3;
            index = 2;
            break;
          case '9个月以上':
            this.status = 4;
            index = 3;
            break;
          default:
            this.status = '';
            index = '';
        }
        chart.setOption(option, false); // 更新设置
        // 点击横坐标的时候显示toolip
        // if (!param.name) {
        //   chart.dispatchAction({
        //     type: 'showTip',
        //     seriesIndex: 0, // 显示第几个series
        //     dataIndex: index, // 显示第几个数据
        //   });
        // }
        this.getInfo();
      });
    },

    /**
       * 筛选
       * @Create By Huan 2019-12-18
       */
    openFiter() {
      this.showFiterPopup = true;
    },
    // 全选
    selectAll(name) {
      switch (name) {
        case 'year':
          this.productYear = this.yearList.map(item => item);
          break;
        case 'month':
          this.productMonth = this.monthList.map(item => item);
          break;

        case 'category':
          this.productCategory = this.categoryList.map(item => item);
          break;
        default:
      }
    },
    // 多选
    select(name, item) {
      let listName = [];
      switch (name) {
        case 'year':
          listName = this.productYear; // 年份
          break;
        case 'month':
          listName = this.productMonth; // 月
          break;

        case 'category':
          listName = this.productCategory; // 大类
          break;
        default:
      }
      this.selectMethod(listName, item);
    },
    selectMethod(list, item) {
      const idx = list.indexOf(item);
      // 如果已经选中了，那就取消选中，如果没有，则选中
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }
    },
    // 取消
    cancelAll(name) {
      switch (name) {
        case 'year':
          this.productYear = [];
          break;
        case 'month':
          this.productMonth = [];
          break;
        case 'category':
          this.productCategory = [];
          break;
        default:
      }
    },
    reset() {
      this.productYear = [];
      this.productMonth = [];
      this.productCategory = [];
    },
    sure() {
      this.showFiterPopup = false;
    },
    closeFiterPopup() {
      this.status = '';
      this.getPieData();
      this.getInfo();
    },
    // 大类查询
    searchCategory() {
      if (this.category) {
        this.categoryList = this.fiterCategory(this.categoryList, this.category);
      } else {
        stock.conditionList()
          .then(({ data }) => {
            this.brandList = data.productBrandList;
            this.productBrand = [];
            this.$nextTick(() => {
              data.productBrandList.forEach((item) => {
                this.productBrand.push(item);
              });
            });
            this.categoryList = data.productCategoryList;
          });
      }
    },
    fiterCategory(list, keyword) {
      const arr = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].indexOf(keyword) >= 0) {
          arr.push(list[i]);
        }
      }

      return arr;
    },
    changeFold(name) {
      switch (name) {
        case 'year':
          this.yearFold = !this.yearFold;
          break;

        case 'month':
          this.monthFold = !this.monthFold;
          break;
        case 'category':
          this.categoryFold = !this.categoryFold;
          break;
        default:
      }
    },
    toDetail(category) {
      this.$router.push({
        name: 'areaInventoryAnalyzeDetail',
        query: {
          productYear: this.productYear,
          productMonth: this.productMonth,
          productCategory: category,
          status: this.status,
          productBrand: this.productBrand,
        },
      });
    },
    // 查看全部的数据
    handleChartBox() {
      this.status = '';
      index = '';
      this.$nextTick(() => {
        this.drawChart(); // 重新渲染
      });
      this.getInfo();
    },
  },
};
</script>

<style lang="scss">
  @import "@/assets/style/goodsAnalyze.scss";

  .remark {
    background: #fff;
    margin-top: vw(10);

    p {
      height: vw(25);
      line-height: vw(25);
      font-size: vw(12);
      padding-left: vw(15);
    }
  }
</style>
