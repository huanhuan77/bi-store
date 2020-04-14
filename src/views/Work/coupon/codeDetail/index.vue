<template>
  <body>
  <main>
    <div class="couponBox">
      <div class="couponItem" style="margin-bottom: 0;">
        <div class="itemHeader">
          <span>优惠券码：{{couponCode}}</span>
          <p class="discount" v-if="!couponInfo.money">{{couponInfo.rebate}}折</p>
          <p class="discount" v-else>{{couponInfo.money}}元</p>
        </div>
        <div class="itemBottom">
          <p>名称：{{couponInfo.couponName}}</p>
          <p>使用人：{{vipMobile}}</p>
          <p v-if="couponInfo.endTime!=='长期有效'">有效期：{{couponInfo.startTime}} 至 {{couponInfo.endTime}}</p>
          <p v-else>有效期：{{couponInfo.endTime}}</p>
        </div>
      </div>
    </div>
    <div class="range">
      <span>使用条件</span>
      <div class="rangeContent">
        <p v-html="couponInfo.remark" v-if="couponInfo.remark"></p>
        <p v-else>暂无</p>
      </div>
      <div class="imageBox">
        <div class="user">
          <!--<span style="margin-right:10px;">{{name}}</span>-->
          <!--<span>扫码使用</span>-->
        </div>
        <img :src="imageSrc" class="image" alt="" style="width: 100%;">
      </div>
    </div>
  </main>
  </body>
</template>

<script>
import axios from 'axios';
import baseURL from "../../../../../public/config/configUrl";
import { Loading } from 'vue-ydui/dist/lib.rem/dialog';
import { couponDetial } from '@/api/coupon';

export default {
  name: 'codeDetail',
  data() {
    return {
      coupon: {},
      imageSrc: '',
      couponInfo: {},
      name: '',
      couponCode: '',
      token: window.localStorage.getItem('token'),
    };
  },
  created() {
    this.couponCode = this.$route.query.couponCode;
    this.vipMobile = this.$route.query.vipMobile;
    this.getCouponDetial();
    this.init();
  },
  methods: {
    getCouponDetial() {
      couponDetial({
        couponCode: this.couponCode,
      })
        .then(({ data }) => {
          this.couponInfo = data;
        })
        .catch(() => {
          this.couponInfo = {};
        });
    },
    init() {
      Loading.open('加载中');
      axios({
        method: 'get',
        url: `${baseURL.apiUrl}vip/getBarCode`,
        params: {
          couponCode: this.couponCode,
        },
        responseType: 'blob', // 改变接收的值类型
        headers: { Authorization: `Bearer ${this.token}` },
      })
        .then(({ data }) => {
          const src = window.URL.createObjectURL(data);// 这里也是关键,调用window的这个方法URL方法
          this.imageSrc = src;
          Loading.close();
        })
        .catch(() => {
          this.$toast({
            message: '获取条形码失败！',
            type: 'fail',
            duration: 1000,
          });
          Loading.close();
        });
    },
  },
};
</script>

<style scoped lang="scss">
  @import '@/assets/style/coupon.scss';

  .imageBox {
    /*padding: vw(20) vw(10) 0 vw(10);*/
    /*font-size: vw(16);*/
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .user {
      height: vw(40);
      line-height: vw(40);
      text-align: center;

      span {
        /*margin-right: vw(10);*/
      }
    }

    .image {
      width: 80%;
      height: 80%;
    }

  }
</style>
