<template>
  <body class="rank">
  <div class="time_header">
    <div class="time_box">
      <span>销售日期：</span>
      <div @click="openTimePopup('start')">{{startDate}}</div>
      <span>--</span>
      <div @click="openTimePopup('end')">{{endDate}}</div>
    </div>

    <div class="timeRange">
      <span class="search" @click="search">查询</span>
    </div>
  </div>

  <main>
    <NowStore @closePopup="closeStorePopup" v-show="type==='店铺'"></NowStore>
    <!-- 商品品牌-->
    <div class="brand_box">
      <span class="brand">商品品牌：</span>
      <yd-checkbox-group v-model="productBrand" size="17" color="#4F77AA" :callback="changeBrand">
        <yd-checkbox
          v-for="(item,index) in brandList"
          :val="item"
          :key="index"
          style="font-size: 15px;"
        ></yd-checkbox>
      </yd-checkbox-group>
    </div>
    <div class="brand_box color_red">
      金额默认为：元
    </div>
    <!-- 区域 店铺-->
    <div class="type_box">
      <van-button type="default" size="small" plain :color="type==='店铺'?'#4F77AA':''"
                  @click="typeClick('店铺')">店铺
      </van-button>
      <van-button type="default" size="small" plain :color="type==='区域'?'#4F77AA':''"
                  @click="typeClick('区域')">区域
      </van-button>
    </div>

    <!--  tab -->
    <van-sticky :offset-top="offsetTop">
      <div class="tab_box">
        <div :class="tab==='数量'?'tab_active':''" @click="tabClick('数量')">数量</div>
        <div :class="tab==='金额'?'tab_active':''" @click="tabClick('金额')">金额</div>
        <div
          :class="productCategory.length ==0 && productYear.length==0 &&
       productMonth.length==0?'color_theme':'color_red fw'"
          @click="openFiter">
          <span>筛选</span>
          <i class="iconfont icon-shaixuan icon"></i>
        </div>
      </div>
    </van-sticky>


    <div class="mm-content" style="padding: 0">
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功"
                        :success-duration=500>
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="list.length===0 ?'暂无数据~':'没有数据了哦~'"
          @load="onLoad"
          :immediate-check="false"
          :offset="100"
        >
          <template v-for="(item,index) in list">
            <div class="rank_box">
              <div class="tag" :style="{background:colorList[index % colorList.length]}">
                TOP{{index+1}}
              </div>
              <van-image
                :src="`${imgUrl.imgUrl}/${item.productStyle}.jpg`"
                @click="imgPreview(item.productStyle)"
              />
              <div class="rank_box_right">
                <p class="van-ellipsis">
                  <span>款号：</span>
                  <span style=" border-right: 1px solid #909399;padding-right: 3px">{{item.productStyle}}</span>
                  <span>
                  {{item.productName}}
                </span>
                </p>

                <p class="attribute van-ellipsis">
                  <span>{{item.productYear}}</span>
                  <span>{{item.productCategory}}</span>
                  <span>{{item.productColor}}</span>
                  <span>{{item.productSize}}</span>
                  <span class="color_red">{{item.productPrice}}</span>
                </p>

                <div class="line_flex">
                  <p>
                    <span>销售数量：</span>
                    <span class="color_theme fw">{{item.sumQty}}</span>
                  </p>
                  <p>
                    <span>{{type==='店铺'?'':'本店'}}在途数量：</span>
                    <span class="color_theme fw">{{item.onQty}}</span>
                  </p>
                </div>
                <div class="line_flex_">
                  <!--                  <p>-->
                  <!--                    <span>销售金额：</span>-->
                  <!--                    <span class="color_theme fw">{{item.sumAmount|formatAmount}}</span>-->
                  <!--                  </p>-->
                  <p>
                    <span>{{type==='店铺'?'':'本店'}}在库数量：</span>
                    <span class="color_theme fw">{{item.inQty}}</span>
                  </p>
                </div>
                <div class="line_flex">
                  <p>
                    <span>销售金额：</span>
                    <span class="color_theme fw">{{item.sumAmount|formatAmount}}</span>
                  </p>
                </div>
                <div class="line_flex_">
                  <p>
                    <span>{{type==='店铺'?'':'本店'}}在途金额：</span>
                    <span class="color_theme fw">{{item.onAmount|formatAmount}}</span>
                  </p>
                </div>
                <div class="line_flex_">
                  <p>
                    <span>{{type==='店铺'?'':'本店'}}在库金额：</span>
                    <span class="color_theme fw">{{item.inAmount|formatAmount}}</span>
                  </p>
                </div>

              </div>
            </div>
          </template>
        </van-list>
      </van-pull-refresh>
    </div>
    <yd-backtop bottom="100px"></yd-backtop>
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
  import {Dialog, ImagePreview} from 'vant';
  import {getThisMonth} from '@/utils';
  import * as rank from '@/api/goodsAnalyze';
  import NowStore from '@/components/nowStore.vue';

  export default {
    name: 'bestsellerRank',
    components: {
      NowStore,
    },
    data() {
      return {
        startDate: '',
        endDate: '',
        currentDate: new Date(),
        time: new Date(), // 可以选择的最大日期
        showTimePopup: false, // 时间弹框
        timeFlag: '', // 开始时间/结束时间的标记
        showFiterPopup: false, // 筛选弹框
        tab: '数量',
        type: '店铺',
        colorList: ['#FC636F', '#F0904B', '#FED429', '#3176F3', '#615CAB', '#16A085', '#2AF598', '#EE74E1'],
        pageNumber: 1,
        pageSize: 10,
        collapseName: ['1', '2', '3'], // 筛选折叠面板
        list: [],
        // 筛选
        category: '',
        productCategory: [], // 大类
        categoryList: [], // 大类列表
        categoryFold: true,
        productYear: [], // 年份
        yearList: [],
        yearFold: true,
        productMonth: [], // 月份
        monthList: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        monthFold: true,
        productBrand: [], // 品牌
        brandList: [], // 品牌列表

        loading: false,
        finished: false,
        refreshLoading: false,
        offsetTop: 0,
      };
    },
    created() {
      this.startDate = getThisMonth();// 当月1号
      this.endDate = new Date().format('yyyy-MM-dd');
      const y = new Date().getFullYear(); // 年份
      this.yearList = [y, y - 1, y - 2, y - 3, y - 4, y - 5, y - 6, y - 7, y - 8, y - 9, y - 10, y - 11, y - 12, y - 13, y - 14]; // 过去15年
      this.getConditionList();
    },
    mounted() {
      window.onresize = function () {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
          const ele = document.activeElement;
          setTimeout(() => {
            ele.scrollIntoView();// 焦点元素滚到可视区域的问题
          }, 0);
        }
      };
      // ios
      document.body.addEventListener('focusout', () => {
        window.scroll(0, 0);// 失焦后强制让页面归位即可
      });

      const height1 = document.getElementsByClassName('headerBox')[0].offsetHeight;
      const height2 = document.getElementsByClassName('time_header')[0].offsetHeight;
      this.offsetTop = height1 + height2;
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
    watch: {
      category(val) {
        if (val) {
          this.categoryList = this.fiterCategory(this.categoryList, val);
        } else {
          this.getConditionList();
        }
      },
    },
    methods: {
      getList() {
        rank.bestSellerRank({
          startDate: this.startDate,
          endDate: this.endDate,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
          storeBranch: window.localStorage.getItem('areaName'),
          status: this.tab === '金额' ? 1 : 0, // 0 数量 1金额
          productCategoryList: this.productCategory,
          productYearList: this.productYear,
          productMonthList: this.productMonth,
          productBrandList: this.productBrand,
          type: this.type === '店铺' ? 1 : 2,
        })
          .then(({data}) => {
            this.list = this.list.concat(data.goodsList);
            this.loading = false;
            this.refreshLoading = false;
            if ((this.list.length >= data.totalCount) || this.list.length === 0) {
              this.finished = true;
            } else {
              this.finished = false;
            }
          })
          .catch(() => {
            this.clearData();
          });
      },
      clearData() {
        this.pageNumber = 1;
        this.list = [];
      },
      getConditionList() {
        rank.conditionList()
          .then(({data}) => {
            this.brandList = data.productBrandList;
            this.categoryList = data.productCategoryList;
            this.$nextTick(() => {
              data.productBrandList.forEach((item) => {
                this.productBrand.push(item);
              });
            });

            this.getList();
          });
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
      // 查询
      search() {
        if (this.startDate > this.endDate) {
          Dialog.alert({
            message: '开始日期不能大于结束日期!',
          }).then(() => {

          });
          return;
        }
        this.clearData();
        this.getList();
      },
      // 品牌
      changeBrand(val) {
        this.productBrand = val;
        this.clearData();
        this.getList();
      },
      // 数量 金额
      tabClick(tab) {
        if (tab === this.tab) return;
        this.clearData();
        this.tab = tab;
        this.getList();
      },
      // 区域  店铺
      typeClick(type) {
        if (type === this.type) return;
        this.clearData();
        this.type = type;
        this.getList();
      },
      // 预览图片
      imgPreview(style) {
        ImagePreview([`${this.imgUrl.imgUrl}/${style}.jpg`]);
      },
      // 店铺组件
      closeStorePopup() {
        this.clearData();
        this.getList();
      },

      /**
       * 筛选
       * @Create By Huan 2019-12-17
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
          // case 'brand':
          //   listName = this.productBrand; // 品牌
          //   break;
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
          // case 'brand':
          //   this.productBrand = [];
          //   break;
          case 'category':
            this.productCategory = [];
            break;
          default:
        }
      },
      reset() {
        this.productYear = [];
        this.productMonth = [];
        // this.productBrand = [];
        this.productCategory = [];
      },
      sure() {
        this.showFiterPopup = false;
      },
      closeFiterPopup() {
        this.clearData();
        this.getList();
      },
      // 大类查询
      searchCategory() {
        if (this.category) {
          this.categoryList = this.fiterCategory(this.categoryList, this.category);
        } else {
          this.getConditionList();
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
      // 筛选 End
      onRefresh() {
        this.reset();
        this.refreshLoading = true;
        this.clearData();
        this.getList();
      },
      // 上拉加载
      onLoad() {
        this.pageNumber += 1;
        this.getList();
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
    },
  };
</script>

<style lang="scss">
  @import "@/assets/style/goodsAnalyze.scss";

  .rank {
    //头部时间选择
    .time_header {
      height: vw(40);
      line-height: vw(40);
      background: $theme-color;
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: #fff;

      span {
        margin: 0 vw(5);
      }

      .time_box {
        display: flex;
        align-items: center;
        font-size: vw(13);

        div {
          border: 1px solid #fff;
          border-radius: vw(15);
          width: vw(100);
          height: vw(25);
          line-height: vw(25);
          text-align: center;
        }

        div:active {
          opacity: .6;
        }
      }

      .timeRange :active {
        opacity: .6;
      }

      .search {
        font-size: vw(15);
      }
    }

    //tab
    .tab_box {
      height: vw(30);
      background: #fff;
      display: flex;
      font-size: vw(13);
      justify-content: space-between;
      padding: vw(5) 0;

      div {
        width: 33%;
        border-right: 1px solid $border_color;
        display: flex;
        justify-content: center;
      }

      div:last-child {
        border-right-color: #fff
      }

      .tab_active {
        color: $theme-color;
      }
    }

    .rank_box:nth-child(1) {
      margin-top: 0 !important;
    }

    .type_box {
      padding: vw(7) vw(10) vw(7) vw(10);

      .van-button {
        width: vw(100);
        border-radius: vw(15);
        margin-right: vw(15);
      }
    }

    .rank_box {
      margin-top: vw(10);
      background: #fff;
      width: 100%;
      /*box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);*/
      /*border-radius: vw(10);*/
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      overflow: hidden;
      padding: vw(7);

      .rank_box_right {
        width: 75%;

        span {
          font-size: vw(12);
          color: $gray_color;

        }

        p {
          height: vw(22);
          line-height: vw(22);
        }

        //属性
        .attribute {
          span {
            padding: 0 vw(2);
            border-right: 1px solid $gray_color;
          }

          span:nth-of-type(1) {
            padding-left: 0;
          }

          span:last-child {
            border-right: none;
          }
        }

        .line_flex {
          display: flex;
          height: vw(22);
          line-height: vw(22);
          justify-content: space-between;

          p {
            width: 50%;
          }
        }

        .line_flex_ {
          display: flex;
          height: vw(22);
          line-height: vw(22);
          justify-content: space-between;

          p {
            width: 100%;
          }
        }
      }

      .van-image {
        width: vw(80);
        height: vw(80);
      }

      .tag {
        position: absolute;
        left: vw(-7);
        top: vw(-10);
        height: vw(35);
        line-height: vw(45);
        width: vw(65);
        text-align: center;
        color: #fff;
        border-radius: vw(10);
        font-weight: bold;
      }
    }
  }
</style>
