<template>
  <body>
  <main>
    <div class="visitTitle">
      <span>消费店铺：</span>
      <span><i>{{storeName}}</i><i>({{storeId}})</i></span>
    </div>
    <div class="items" v-for="(item ,index) in list" :key="index">
      <div class="style_img">
        <img :src="`${imgUrl.imgUrl}${item.style}.jpg`" alt="" style="height: 60px;width: 80px"
             @click="imgView(item.style)">
      </div>
      <div class="items_content">
        <div class="items_content_left">
          <div>款号：<span>{{item.style}}</span></div>
          <div>尺码：<span>{{item.sizeName}}</span></div>
          <div>颜色：{{item.colorName}}</div>
          <div>单款折扣：{{item.discount}}折</div>
          <div>标准单价：<span style="color: #d70d17">¥{{item.price}}</span></div>
          <!--          <div>总价：<span style="color: #d70d17">¥{{item.amount}}</span></div>-->
        </div>
        <div class="items_content_right">
          <div>×{{item.orderQty}}</div>
          <div>总价：<span style="color: #d70d17">¥{{item.amount}}</span></div>
        </div>
      </div>
    </div>
  </main>
  <!--图片预览组件-->
  <van-image-preview
    v-model="showImg"
    :images="images">
  </van-image-preview>
  </body>
</template>

<script>
  import { consumeDetail, couponSalesDetails } from '@/api/vip';

  export default {
    name: 'consumeDetail',
    data() {
      return {
        list: [],
        number: '',//商品编号
        showImg: false, // 图片预览
        images: [],
        couponCode: '',//优惠券码
        storeId: '',
        storeName:'',
      };
    },
    created() {
      this.number = this.$route.query.number;
      this.couponCode = this.$route.query.couponCode;
      this.storeId = this.$route.query.storeId;
      this.storeName = this.$route.query.storeName;
      if (this.couponCode) {
        this.getCouponSalesDetails();
      } else {
        this.getDetails();
      }
    },
    methods: {
      getDetails() {
        consumeDetail({
          orderNum: this.number,
        })
          .then((res) => {
            this.list = res.data.list;
          })
          .catch(() => {
            this.list = [];
          });
      },
      imgView(imgUrl) {
        this.images = [];
        this.showImg = true;
        const url = `${this.imgUrl.imgUrl}${imgUrl}.jpg`;
        this.images.push(url);
      },
      getCouponSalesDetails() {
        couponSalesDetails({
          couponCode: this.couponCode
        })
          .then(({ data }) => {
            this.number = data.saleOrderNum;
            this.getDetails();
          })
          .catch(() => {
            this.number = '';
          });
      }
    },
  };
</script>

<style scoped lang="scss">
  .items {
    font-size: vw(14);
    background: #fff;
    /*margin-top: vw(8);*/
    padding: vw(10);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed $tableBorder;

    .items_content {
      width: 68%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .items_content_left {
        color: $gray_color;
        padding: vw(10);
      }

      .items_content_right {
        text-align: center;
        display: flex;
        align-items: center;
        flex-direction: column;

        div {
          width: 100%;
          height: vw(20);
          line-height: vw(20);
        }
      }
    }

  }
</style>
