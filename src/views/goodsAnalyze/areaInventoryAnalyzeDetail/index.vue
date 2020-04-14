<template>
  <body>
<!--   <div class="table tableHead" style="margin-top: 0">-->
<!--     <table border="0" cellspacing="0" cellpadding="0" rules="groups">-->
<!--       <tbody>-->
<!--       <tr>-->
<!--         <td class="table_border_right"></td>-->
<!--         <td colspan="2" class="table_border_right table_color_gray">在库</td>-->
<!--         <td colspan="2" class="table_border_right table_color_gray">在途</td>-->
<!--         <td colspan="2" class="table_color_gray table_border_right">欠数</td>-->
<!--       </tr>-->
<!--       <tr>-->
<!--         <td width="20%" class="table_border_right table_color_gray"> 款号 </td>-->
<!--         <td width="10%" class="table_color_gray">数量</td>-->
<!--         <td width="10%" class="table_color_gray table_border_right">金额</td>-->

<!--         <td width="15%" class="table_color_gray">数量</td>-->
<!--         <td width="15%" class="table_border_right table_color_gray">金额</td>-->

<!--         <td width="15%" class="table_color_gray">数量</td>-->
<!--         <td  class="table_color_gray table_border_right">金额</td>-->
<!--       </tr>-->
<!--       </tbody>-->
<!--     </table>-->
<!--   </div>-->

  <main>
    <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功"
                      :success-duration=500>
      <van-list  v-model="loading"
                 :finished="finished"
                 :finished-text="list.length ===0 ?'暂无数据~':'没有数据了哦~'"
                 @load="onLoad"
                 :immediate-check="false"
                 :offset="100">
    <div class="table">
      <table border="0" cellspacing="0" cellpadding="0" rules="groups">
        <tbody>
               <tr>
                 <td class="table_border_right"></td>
                 <td colspan="2" class="table_border_right table_color_gray">在库</td>
                 <td colspan="2" class="table_border_right table_color_gray">在途</td>
                 <td colspan="2" class="table_color_gray table_border_right">订单欠数</td>
               </tr>
               <tr>
                 <td width="20%" class="table_border_right table_color_gray"> 款号 </td>
                 <td width="10%" class="table_color_gray table_border_right">数量</td>
                 <td width="10%" class="table_color_gray table_border_right">金额</td>

                 <td width="15%" class="table_color_gray table_border_right">数量</td>
                 <td width="15%" class="table_border_right table_color_gray">金额</td>

                 <td width="15%" class="table_color_gray table_border_right">数量</td>
                 <td  class="table_color_gray table_border_right">
                   <p>标准</p>
                   <p>金额</p>
                 </td>
               </tr>
               <tr>
                 <td class="table_border_right fw">合计</td>
                 <td class="fw table_border_right">{{stockCategoryTotal.inQty|formatAmount}}</td>
                 <td class="table_border_right fw">{{stockCategoryTotal.inAmount|formatAmount}}</td>
                 <td class="fw table_border_right">{{stockCategoryTotal.onQty|formatAmount}}</td>
                 <td class="table_border_right fw">{{stockCategoryTotal.onAmount|formatAmount}}</td>
                 <td class="fw table_border_right">{{stockCategoryTotal.oweTotalQty|formatAmount}}</td>
                 <td class="fw">{{stockCategoryTotal.oweTotalAmount|formatAmount}}</td>
               </tr>
        <template v-if="list.length !==0">
          <tr v-for="(item,index) in list" :key="index">
            <!-- 款号-->
            <td width="20%"  @click="lookDetail(item)"  class="color_theme table_border_right style">
              {{item.productStyle}}
            </td>
            <!-- 在库数量-->
            <td width="10%" class="table_border_right">{{item.inQty|formatAmount}}</td>
            <!-- 在库金额-->
            <td width="10%" class="table_border_right">{{Math.round(item.inAmount)|formatAmount}}</td>
            <!-- 在途数量-->
            <td width="15%" class="table_border_right">{{item.onQty|formatAmount}}</td>
            <!-- 在途金额-->
            <td width="15%" class="table_border_right">{{Math.round(item.onAmount)|formatAmount}}</td>
            <!-- 欠数数量-->
            <td width="15%" class="table_border_right">{{item.oweQty|formatAmount}}</td>
            <!-- 欠数金额-->
            <td class="table_border_right">{{Math.round(item.oweAmount)|formatAmount}}</td>
            <!--          <td class="color_theme" @click="lookDetail(item.productStyle,item.productName)">查看</td>-->
          </tr>
        </template>

<!--        <tr v-else>-->
<!--          <td colspan="8" class="noData">暂无数据</td>-->
<!--        </tr>-->
        </tbody>
      </table>
    </div>
      </van-list>
    </van-pull-refresh>
    <yd-backtop bottom="100px"></yd-backtop>
  </main>


<!--弹框-->
  <van-popup v-model="showDetailPopup" positon="center" round style="width: 80%" close-on-popstate>
    <div class="image_popup_box">
      <div class="styleName">
        <span>商品款号：</span><span>{{product.productStyle}}</span>
      </div>
      <div class="styleName">
        <span>商品名称：</span><span>{{product.productName}}</span>
      </div>
      <div class="styleName">
        <span>商品年月：</span><span>{{product.productYear}}年</span>
        <span>{{product.productSeason}}月</span>
      </div>

      <div class="styleName">
        <span>标准价：</span><span style="color: #d70d17">¥{{product.productPrice}}</span>
      </div>
      <van-image
        width="200px"
        height="200px"
        style="margin:20px auto 0"
        :src="`${imgUrl.imgUrl}/${product.productStyle}.jpg`"
         @click="imgPreview"
      />
      <van-icon name="close" size="30" color="#ccc"   style="margin:50px auto 0"
                @click="showDetailPopup=false"/>
    </div>
  </van-popup>

  </body>
</template>

<script>
import { stockDetail } from '@/api/goodsAnalyze';
import { ImagePreview } from 'vant';

export default {
  name: 'areaInventoryAnalyzeDetail',
  data() {
    return {
      productYear: '',
      productMonth: '',
      productCategory: '',
      productBrand: [],
      status: '',
      pageSize: 25,
      pageNumber: 1,
      list: [],
      showDetailPopup: false,
      product: {
        productName: '',
        productPrice: 0,
        productSeason: '',
        productStyle: '',
        productYear: '',
      },
      // 合计
      stockCategoryTotal: {
        cAmount: 0,
        cQty: 0,
        inAmount: 0,
        inQty: 0,
        onAmount: 0,
        onQty: 0,
      },

      loading: false,
      finished: false,
      refreshLoading: false,
    };
  },
  created() {
    // url参数 productYear 或productMonth为空 刷新会报错  默认给空数组
    this.productYear = this.$route.query.productYear ? this.$route.query.productYear : [];
    this.productMonth = this.$route.query.productMonth ? this.$route.query.productMonth : [];
    this.productCategory = this.$route.query.productCategory;
    this.status = this.$route.query.status;
    this.productBrand = this.$route.query.productBrand ? this.$route.query.productBrand : [];
    this.getDetail();
  },
  methods: {
    getDetail() {
      stockDetail({
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        productYear: this.productYear,
        productMonth: this.productMonth,
        productCategory: this.productCategory,
        status: this.status,
        productBrandList: this.productBrand,
      })
        .then(({ data }) => {
          this.list = this.list.concat(data.list);

          this.stockCategoryTotal = data.stockCategoryTotal;

          this.loading = false;
          this.refreshLoading = false;
          if ((this.list.length >= data.totalCount) || this.list.length === 0) {
            this.finished = true;
          } else {
            this.finished = false;
          }
        })
        .catch(() => {
          this.list = [];
          this.pageNumber = 1;
          this.stockCategoryTotal = {
            cAmount: 0,
            cQty: 0,
            inAmount: 0,
            inQty: 0,
            onAmount: 0,
            onQty: 0,
          };
        });
    },
    lookDetail(item) {
      this.showDetailPopup = true;
      this.product = item;
    },
    onRefresh() {
      this.refreshLoading = true;
      this.list = [];
      this.pageNumber = 1;
      this.getDetail();
    },
    // 上拉加载
    onLoad() {
      this.pageNumber += 1;
      this.getDetail();
    },
    imgPreview() {
      ImagePreview([`${this.imgUrl.imgUrl}/${this.product.productStyle}.jpg`]);
    },

  },

};
</script>

<style scoped lang="scss">
  @import "@/assets/style/goodsAnalyze.scss";

  .image_popup_box {
    display: flex;
    flex-direction: column;
    padding: vw(20) vw(10);

    .styleName {
      width: 100%;
      padding-left: vw(40);
      line-height: vw(25);
      font-size: vw(14);

    }
  }

</style>
