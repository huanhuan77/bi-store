<template>
  <body>
  <main>
    <div class="box">
      <div class="items">
        <div class="items_content">
          <div class="left">
            <img :src="`${imgUrl.imgUrl}${list.productStyle}.jpg`" alt="" width="100" height="90"
                 @click="imgView(list.productStyle)">
          </div>
          <div class="right">
            <div>款号：<span>{{list.productStyle}}</span></div>
            <div>名称：<span>{{list.productName}}</span></div>
            <div>品牌：<span>{{list.productBrand}}</span></div>
            <div>年月：<span>{{list.productYear}}</span></div>
            <div>大类：<span>{{list.productCategory}}</span></div>
            <div>旧大类：<span>{{list.productOldCategory}}</span></div>
            <div>小类：<span>{{list.productSubcategory}}</span></div>
            <div>尺码：<span>{{list.productSize}}</span></div>
            <div>颜色：<span>{{list.productColor}}</span></div>
            <div>吊牌价：<span style="color: #d70d17">¥{{list.productPrice}}</span></div>
          </div>
        </div>
      </div>

      <!--    图片预览组件-->
      <van-image-preview
        v-model="showImg"
        :images="images">
      </van-image-preview>
    </div>
  </main>
  </body>
</template>
<script>
  import { goodSearch } from '../../../api/work';

  export default {
    name: 'goodsDetail',
    data() {
      return {
        index: this.$route.query.index,//点击的索引
        type: this.$route.query.type,//商品款号
        search: this.$route.query.search,//查询的关键字
        pageNumber: 1,
        pageSize: 10,
        list: {},
        showImg: false, // 图片预览
        images: [],
      };
    },
    created() {
      this.getDetail();
    },
    methods: {
      getDetail() {
        goodSearch({
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          type: this.type,
          search: this.search
        })
          .then((res) => {
            this.list = res.data.data[this.index];
            //console.log(this.list);
          });
      },
      imgView(imgUrl) {
        this.images = [];
        this.showImg = true;
        const url = `${this.imgUrl.imgUrl}${imgUrl}.jpg`;
        this.images.push(url);
      },
    }
  };
</script>

<style lang="scss" scoped>

  .items {
    font-size: vw(14);
    position: relative;
    margin: vw(8) 0;

    .items_content {
      width: 100%;
      background-color: #fff;
      display: flex;
      align-items: center;
      padding: vw(10);

      .left {
        width: 40%;
      }

      .right {
        width: 60%;

        div {
          color: #999;
          padding: vw(2) 0;

          span {
            color: #666;
          }
        }
      }

    }

  }
</style>
