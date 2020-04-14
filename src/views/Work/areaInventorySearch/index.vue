<template>
  <body>
  <div class="member_search">
    <span>商品款号：</span>
    <input type="text" class="input" placeholder="请输入商品款号" v-model="style" @keyup.enter="search">
    <van-button type="default" class="search_button" @click="search">查询</van-button>
  </div>

  <template v-if="list.length !=0">
    <div class="style_img">
      <img :src="`${imgUrl.imgUrl}${style}.jpg`" alt="" style="height: 60px;width: 80px" @click="imgView">
    </div>
    <div class="table tableHead">
      <table border="0" cellspacing="0" cellpadding="0" rules="groups">
        <tbody>
        <tr>
          <td width="40%">店铺名称</td>
          <td width="30%">电话</td>
          <td width="20%">款号</td>
          <td width="10%">库存</td>
        </tr>
        </tbody>
      </table>
    </div>
    <main>
      <div class="mm-content">
        <div class="table">
          <table border="0" cellspacing="0" cellpadding="0" rules="groups">
            <tbody>
            <van-list
              :offset="10"
              :immediate-check="false"
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad">
              <tr v-for="(item,index) in list" :key="index">
                <td width="40%">{{item.storeName}}</td>
                <td width="30%" @click="call" style="color: #10AEFF">{{item.tel}}</td>
                <td width="20%">{{item.productStyle}}</td>
                <td width="10%">{{item.qty}}</td>
                <!--展示弹出层-->
                <van-popup v-model="showTel" class="callTel" round>
                  <div>
                    <a :href='`tel:${item.tel}`'>
                      <van-icon name="phone"/>
                      呼叫</a>
                    <a :href='`sms:${item.tel}`'>
                      <van-icon name="comment"/>
                      发送短信</a>
                  </div>
                </van-popup>
              </tr>
            </van-list>
            </tbody>
          </table>
        </div>
      </div>
      <yd-backtop bottom="140px"></yd-backtop>
    </main>

    <!--图片预览组件-->
    <van-image-preview
      v-model="showImg"
      :images="images">
    </van-image-preview>
  </template>


  </body>
</template>

<script>
  import TabBar from '@/components/tab-bar.vue';
  import { stockStyle } from '@/api/work';

  export default {
    name: 'areaInventorySearch',
    components: { TabBar },
    data() {
      return {
        style: '',
        pageSize: 15,
        pageNumber: 1,
        list: [],
        loading: false,
        finished: false,
        showImg: false, // 图片预览
        images: [],
        showTel: false,
      };
    },
    methods: {
      call() {
        this.showTel = true;
      },
      getStockStyle() {
        stockStyle({
          productStyle: this.style,
          storeBranch: window.localStorage.getItem('areaName'),
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
        })
          .then((res) => {
            if (res.data.data.length == 0) {
              this.$dialog.toast({
                mes: '没有数据 !',
                timeout: 800,
              });
            } else {
              this.list = res.data.data;
              this.finished = false;
              const url = `${this.imgUrl.imgUrl}${this.style}.jpg`;
              this.images.push(url);
            }
          })
          .catch(() => {
            this.list=[];
            this.finished = false;
          });
      },
      search() {
        this.style = this.style.trim();
        if (this.style == '') {
          this.$toast({
            message: '请输入商品款号',
            duration: 800,
          });
          return;
        }
        this.pageNumber = 1;
        this.getStockStyle();
      },
      onLoad() {
        this.pageNumber += 1;
        stockStyle({
          productStyle: this.style,
          storeBranch: window.localStorage.getItem('areaName'),
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
        })
          .then((res) => {
            this.loading = false;
            const { list } = this;
            this.list = list.concat(res.data.data);
            if (this.list.length >= res.data.totalCount) {
              this.finished = true;
            } else {
              this.finished = false;
            }
          });
      },
      imgView() {
        this.showImg = true;
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "@/assets/style/member-public.scss";

  .style_img {
    height: vw(80);
    background: #fff;
    margin-top: vw(10);
    padding: 0 vw(10);
    position: relative;

    img {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      left: 50%;
    }
  }


  /*不滚动内容*/
  .tableHead {
    padding: 0 vw(10);
    font-size: vw(14);
    background: #fff;
    margin-top: vw(8);
    height: vw(30);
    line-height: vw(30);
    color: $gray_color;
    border-bottom: 1px solid $tableBorder;
  }

  /*滚动区域*/
  .mm-content {
    .table {
      padding: 0 vw(10);
    }
  }

  .table {
    font-size: vw(14);
    height: auto;
    background: #fff;

    table {
      width: 100%;
      /*border-bottom: 1px solid #E5E5E5;*/
      td {
        border-bottom: 1px solid $tableBorder;
        text-align: center;
        /*line-height: vw(28);*/
        text-overflow: ellipsis;
        vertical-align: middle;
        font-size: vw(14);
        padding: vw(6) 0;
      }
    }
  }

  .callTel {
    width: 76%;

    a {
      display: block;
      font-size: vw(14);
      height: vw(50);
      line-height: vw(50);
      padding: 0 vw(30);
      border-bottom: 1px solid $border_color;

      i {
        font-size: vw(16);
        margin-right: vw(10);
      }
    }
  }
</style>
