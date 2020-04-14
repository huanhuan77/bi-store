<template>
  <div>
    <div class="multiple_store_header">
        <van-button type="default" size="small" :class="[selectStore.length !==0?'select screen':'select']"
                    @click="fiter"  >店铺选择
        </van-button>
    </div>

    <!--筛选-->
    <van-popup v-model="show" position="right" style="height: 100%;width:80%;z-index: 9999"
               @close="closePopup" get-container="body">
      <div class="box">
        <van-cell style="background:#f4f4f4 ">店铺列表</van-cell>
        <van-cell>
          <div class="store_input">
            <input type="text" v-model.trim="storeName" placeholder="请输入店铺名称/店铺编号">
            <van-icon name="close" size="20" v-show="storeName" @click.native="clearStoreName"/>
          </div>
          <div class="store_search" @click="searchStore">查询</div>
        </van-cell>

        <div class="main" id="main">
          <van-list
            v-model="loading"
            :finished="finished"
            :finished-text="storeList.length===0?'没有匹配到相应的店铺~':'没有更多了~'"
            @load="onLoad"
            :offset="10"
            :immediate-check="false"
          >
            <template v-if="storeList.length !==0">
              <van-checkbox-group v-model="selectStore"   :max="10" >
                <van-cell v-for="(item,index) in storeList" :key="index" >
                  <van-checkbox
                    :name="item"
                    ref="checkboxes"
                    shape="square"
                    label-position="right"
                    checked-color="#4F77AA">
                    {{item.storeName}}
                  </van-checkbox>
                </van-cell>
              </van-checkbox-group>
            </template>

          </van-list>
          <yd-backtop bottom="100px"></yd-backtop>
        </div>
        <div class="bottom">
          <van-button size="small" id="reset" @click="reset">重置</van-button>
          <van-button type="info" size="small " @click="sure">确定</van-button>
        </div>
      </div>
    </van-popup>
  </div>

</template>

<script>

export default {
  name: 'nowStore',

  data() {
    return {
      show: false,
      pageSize: 15,
      pageNumber: 1,
      storeList: [],
      allStoreList: [],
      selectStore: [],
      storeName: '',
      loading: false,
      finished: false,
    };
  },
  created() {
    this.allStoreList = this.getAllStoreList();
    this.getStoreList();

  },
  activated() {
    this.storeName = '';
    this.allStoreList = this.getAllStoreList();
    this.getStoreList();
  },
  mounted() {
    document.body.addEventListener('focusout', () => {
      window.scroll(0, 0);// 失焦后强制让页面归位即可
    });
  },

  methods: {
    // 获取全部店铺
    getAllStoreList() {
      return JSON.parse(window.localStorage.getItem('targetStoreList')); // 全部列表
    },
    // 获取店铺列表
    getStoreList() {
      this.loading = true;
      this.pageNumber = 1;
      this.storeList = this.pagination(this.allStoreList, this.pageNumber, this.pageSize); // 店铺列表
      this.loading = false;
      // 弹框展开才有main元素
      if (this.show) {
        // 回到顶部
        const main = document.getElementById('main');
        main.scrollTop = 0;
      }
      if (this.storeList.length >= this.allStoreList.length) {
        this.finished = true;
      } else {
        this.finished = false;
      }
    },
    // 分页
    pagination(array, pageNo, pageSize) {
      const offset = (pageNo - 1) * pageSize;
      const data = (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
      return data;
    },
    // 上拉加载
    onLoad() {
      this.loading = true;
      this.pageNumber += 1;
      setTimeout(() => {
        this.storeList = this.storeList.concat(this.pagination(this.allStoreList, this.pageNumber, this.pageSize)); // 店铺列表
        this.loading = false;
      }, 200);

      if (this.storeList.length >= this.allStoreList.length) {
        this.finished = true;
      } else {
        this.finished = false;
      }
    },
    fiter() {
      this.$emit('fiter');
      this.show = true;
    },
    sure() {
      this.show = false;
    },
    closePopup() {
      this.$emit('closePopup', this.selectStore);
    },
    // 点击清除按钮
    clearStoreName() {
      this.storeName = '';
      this.storeList = [];
      this.allStoreList = this.getAllStoreList();
      this.getStoreList();
    },
    reset() {},
    // 查询店铺
    searchStore() {
      if (this.storeName) {
        this.allStoreList = this.fiterStore(this.getAllStoreList(), this.storeName);
        this.storeList = [];
        this.getStoreList();
      } else {
        // 数据为空的时候查看全部数据
        this.allStoreList = this.getAllStoreList();
        this.storeList = [];
        this.getStoreList();
      }
    },
    // 筛选数据
    fiterStore(list, keyword) {
      const arr = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].storeName.indexOf(keyword) >= 0 || list[i].storeNo.indexOf(keyword) >= 0) {
          arr.push(list[i]);
        }
      }

      return arr;
    },
  },
  watch: {
    // 模糊查询店铺名称
    storeName(val) {
      if (val) {
        this.allStoreList = this.fiterStore(this.getAllStoreList(), this.storeName);
        this.storeList = [];
        this.getStoreList();
      } else {
        // 数据为空的时候查看全部数据
        this.allStoreList = this.getAllStoreList();
        this.storeList = [];
        this.getStoreList();
      }
    },
  },
};
</script>

<style lang="scss">
  .store_input {
    height: vw(30);
    line-height: vw(25);
    border: 1px solid #ccc;
    border-radius: vw(5);
    /*margin-bottom: vw(10);*/
    display: inline-block;
    position: relative;
    width: vw(220);
    padding-right: vw(25);

    input {
      width: 100%;
      height: 100%;
      padding-left: vw(10);
      border: none;
    }

    .van-icon-close {
      position: absolute;
      right: vw(5);
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .store_search {
    float: right;
    height: vw(30);
    line-height: vw(30);
    color: $theme-color;
    font-size: vw(14) !important;
  }

  .store_search:active, .van-icon-close:active {
    opacity: .6;
  }

  .screen {
    background-color: $theme-color;

    span {
      color: #fff;
    }
  }


  .multiple_store_header {
    height: vw(45);
    line-height: vw(45);
    background-color: #fff;
    padding: 0 vw(10);
    font-size: vw(14);
    text-align: right;
    border-bottom: 1px solid $border_color;

    /*筛选*/
    .select {
      border: 1px solid $theme-color;
      color: $theme-color;
      border-radius: vw(6);
      line-height: 22px;
      font-size: vw(14);
      margin-left: vw(5);
    }

  }

  #reset {
    margin-right: vw(15);
    background: $body_background_color;
    color: #1989fa;
  }

  .bottom{
    button{
      width: vw(100);
    }
  }

</style>
