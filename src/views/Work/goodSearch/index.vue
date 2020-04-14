<template>
  <body>
  <div class="member_search">
    <!--商品款号和商品名称-->
    <van-dropdown-menu>
      <van-dropdown-item v-model="value" :options="option" @change="change"/>
    </van-dropdown-menu>
    <input type="text" class="input" placeholder="请输入准确的商品款号" v-model="inputValue1" v-if="value==1"
           @keyup.enter="search">
    <input type="text" class="input" placeholder="请输入商品名称" v-model="inputValue2" v-if="value==2" @keyup.enter="search">
    <van-button type="default" class="search_button" @click="search">查询</van-button>
  </div>
  <template v-if="list.length !=0">
    <div class="table tableHead">
      <table border="0" cellspacing="0" cellpadding="0" rules="groups">
        <tbody>
        <tr>
          <td width="25%">款号</td>
          <td width="30%">名称</td>
          <td width="20%">颜色</td>
          <td width="10%">尺码</td>
          <td width="15%">吊牌价</td>
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
              <table border="0" cellspacing="0" cellpadding="0">
                <tbody>
                <tr v-for="(item,index) in list" :key="index" @click="goodsDetail(index)">
                  <td width="25%" style="color: rgb(15, 144, 210);">{{item.productStyle}}</td>
                  <td width="30%">{{item.productName}}</td>
                  <td width="20%">{{item.productColor}}</td>
                  <td width="10%">{{item.productSize}}</td>
                  <td width="15%">{{item.productPrice}}</td>
                </tr>
                </tbody>
              </table>
            </van-list>
            </tbody>
          </table>
        </div>
      </div>
      <yd-backtop bottom="140px"></yd-backtop>
    </main>
  </template>
  </body>
</template>

<script>
  import { goodSearch } from '@/api/work';

  export default {
    name: 'goodSearch',
    data() {
      return {
        value: 1,
        option: [
          {
            text: '商品款号',
            value: 1,
          },
          {
            text: '商品名称',
            value: 2,
          },
        ],
        pageSize: 15,
        pageNumber: 1,
        list: [],
        loading: false,
        finished: false,
        inputValue: '',

        inputValue1: '',
        inputValue2: '',

        total1: 0,
        total2: 0,
      };
    },
    methods: {
      change(value) {
        this.value = value;
      },
      getGoodsList() {
        goodSearch({
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          type: this.value,
          search: this.inputValue,
        })
          .then((res) => {
            // console.log(res);
            // if (res.data == null) {
            //   this.$dialog.toast({
            //     mes: `${res.msg}`,
            //     timeout: 800,
            //   });
            //   return;
            // }
            this.list = res.data.data;
            if (this.value == 1) {
              // 商品款号总数
              this.total1 = res.data.totalCount;
            } else {
              // 商品名称总数
              this.total2 = res.data.totalCount;
            }
            // console.log(res.data);
          })
          .catch(() => {
            this.list=[];
          });
      },
      search() {
        this.list = [];
        if (this.value == 1) {
          this.inputValue = this.inputValue1.trim();
        } else if (this.value == 2) {
          this.inputValue = this.inputValue2.trim();
        }
        if (this.inputValue == '') {
          this.$toast({
            message: '请输入关键字 !',
            duration: 800,
          });
          return;
        }
        this.pageNumber = 1;
        this.getGoodsList();
      },
      onLoad() {
        this.pageNumber += 1;
        goodSearch({
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          type: this.value,
          search: this.inputValue,
        })
          .then((res) => {
            this.loading = false;
            const { list } = this;
            this.list = list.concat(res.data.data);
            if (this.value == 1) {
              // 商品款号总数
              this.total1 = res.data.totalCount;
              if (this.list.length >= this.total1) {
                this.finished = true;
              } else {
                this.finished = false;
              }
            } else {
              // 商品名称总数
              this.total2 = res.data.totalCount;
              if (this.list.length >= this.total2) {
                this.finished = true;
              } else {
                this.finished = false;
              }
            }
            // console.log(res.data);
          });
      },
      goodsDetail(index) {
        this.$router.push({
          name: 'goodsDetail',
          query: {
            index,
            search: this.inputValue,
            type: this.value,
          },
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "@/assets/style/member-public.scss";

  .van-button--normal {
    /*padding: 0;*/
  }

  /*不滚动内容*/
  .tableHead {
    font-size: vw(13);
    background: #fff;
    margin-top: vw(8);
    height: vw(30);
    line-height: vw(30);
    color: $gray_color;

    tr {
      width: 100%;
      display: flex;
    }
  }

  /*滚动区域*/
  .mm-content {
    .table {
      /*padding: 0 vw(10);*/
    }
  }

  .table {
    font-size: vw(13);
    height: auto;
    background: #fff;
    width: 100%;

    table {
      width: 100%;

      tr {
        width: 100%;
        display: flex;
      }

      td {
        border-bottom: 1px solid $tableBorder;
        text-align: center;
        height: vw(36);
        line-height: vw(36);
        text-overflow: ellipsis;
        vertical-align: middle;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }


  .van-list {
    width: 100%;

    tr {
      /*width: 100%;*/
    }
  }

  .van-dropdown-menu {
    float: left;
    margin-right: vw(12);
  }

  /*scoped中修改不了vant的样式*/
  .van-dropdown-menu__title::after {
    content: '';
    /*top: 0.5rem;*/
  }


</style>
