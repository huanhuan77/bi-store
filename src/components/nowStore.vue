<template>
  <div>
    <div class="store_header">
      <div class="list_box" style="display: flex;align-items: center;padding: 0;">
        <span class="list_name">当前店铺：</span>
        <span class="storeName" style="color:#4F77AA;">{{radioStoreName}}</span>
        <van-button type="default" size="small" :class="[radioStore?'select screen':'select']"
                    @click="fiter" >店铺选择
        </van-button>
      </div>
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

<!--        <van-cell>-->
<!--          <van-button class="more" @click="changeFold" size="small"-->
<!--                      v-show="storeList.length !==0&&storeList.length>15">收起-->
<!--          </van-button>-->
<!--        </van-cell>-->
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
              <van-radio-group v-model="radioStore">
                <van-cell v-for="(item,index) in storeList" :key="index">
                  <van-radio :name="item.storeNo" checked-color="#4F77AA">{{item.storeName}}
                  </van-radio>
                </van-cell>
              </van-radio-group>
            </template>

<!--            <van-cell v-else>-->
<!--              <div class="store_nodata">没有匹配的店铺!</div>-->
<!--            </van-cell>-->
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
      radioStoreName: '',
      radioStore: '',
      pageSize: 15,
      pageNumber: 1,
      storeList: [],
      allStoreList: [],
      areaName: '',
      storeName: '',
      loading: false,
      finished: false,
    };
  },
  created() {
    this.radioStore = window.localStorage.getItem('storeNo'); // 店铺代码
    // this.getAllStoreList();
    this.allStoreList = this.getAllStoreList();
    this.getStoreList();
    this.setStoreName();
  },
  activated() {
    this.radioStore = window.localStorage.getItem('storeNo'); // 店铺代码
    this.storeName = '';
    // this.getAllStoreList(); // 全部列表
    this.allStoreList = this.getAllStoreList();
    this.getStoreList();
    this.setStoreName();
  },
  mounted() {
    document.body.addEventListener('focusout', () => {
      window.scroll(0, 0);// 失焦后强制让页面归位即可
    });
  },

  methods: {
    // 获取全部店铺
    getAllStoreList() {
      return JSON.parse(window.localStorage.getItem('listStore')); // 全部列表
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
    // 收起
    // changeFold() {
    //   this.storeList = [];
    //   this.getAllStoreList();
    //   this.getStoreList();
    // },
    fiter() {
      this.$emit('fiter');
      this.show = true;
    },
    sure() {
      this.show = false;
      // this.$emit('sure');
    },
    closePopup() {
      this.setStoreName();
      window.localStorage.setItem('storeNo', this.radioStore);
      this.$emit('closePopup');
    },
    // 点击清除按钮
    clearStoreName() {
      this.storeName = '';
      this.storeList = [];
      this.allStoreList = this.getAllStoreList();
      this.getStoreList();
    },
    // 设置选中
    setStoreName() {
      this.allStoreList.forEach((item) => {
        if (item.storeNo === this.radioStore) {
          this.radioStoreName = item.storeName;
          this.areaName = item.areaName;
        }
        window.localStorage.setItem('storeName', this.radioStoreName);
        window.localStorage.setItem('areaName', this.areaName);
      });
    },

    reset() {
      // 重置店铺
      this.radioStore = JSON.parse(window.localStorage.getItem('listStore'))[0].storeNo;
      window.localStorage.setItem('storeNo', this.radioStore);
      this.setStoreName();
    },
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
    '$route.name': function (newVal, oldVal) {
      const newRes = newVal === 'memberDetail' || newVal === 'empSales' || newVal === 'totalPerformanceDetail' || newVal === 'clerkAnalyzeDetail'
          || newVal === 'areaInventoryAnalyzeDetail' || newVal === 'currentVipConsumption' || newVal === 'vipLabelMaintainDetail'
          || newVal === 'performanceAdd' || newVal === 'recruitAdd';
      if (newRes) return;
      const res = oldVal === 'vipBirthday' || oldVal === 'vipConsumption' || oldVal === 'vipConsume'
          || oldVal === 'totalPerformance' || oldVal === 'clerkAnalyze' || oldVal === 'bestsellerRank' || oldVal === 'areaInventoryAnalyze'
          || oldVal === 'vipLabelMaintain' || oldVal === 'performanceIndicator' || oldVal === 'recruitIndicator';
      if (res) {
        this.radioStore = JSON.parse(window.localStorage.getItem('listStore'))[0].storeNo;
        window.localStorage.setItem('storeNo', this.radioStore);
        this.setStoreName();
      }
    },
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

  .store_nodata {
    text-align: center;
    flex-grow: 1;
    height: vw(40);
    line-height: vw(40);
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

  .storeName {
    width: vw(200);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

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


  .store_header {
    height: vw(45);
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;
    background-color: #fff;
    padding: 0 vw(10);
    font-size: vw(14);

    .list_box {
      width: 100%;
      padding: 0 vw(6);
      border-bottom: 1px solid $border_color;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }

    .list_name {
      line-height: vw(45);
    }

    .list_name:first-of-type {
      color: #909399;
      /*margin-right: vw(10);*/
    }

    /*筛选*/
    .select {

      border: 1px solid $theme-color;
      color: $theme-color;
      border-radius: vw(6);
      line-height: 22px;
      font-size: vw(14);
      margin-left: vw(5);
    }

    .vanBottom {
      display: inline-block;
      width: vw(100);
      height: vw(30);
      margin-left: vw(8);
    }
  }

  .more {
    background: #e6e6e6;
    border-radius: vw(5);
    width: vw(100);
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
