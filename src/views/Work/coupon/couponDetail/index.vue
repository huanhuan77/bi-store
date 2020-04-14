<template>
  <body>
  <main id="#bigMain">
    <van-action-sheet v-model="show" round :actions="actions" @select="onSelect" cancel-text="取消"
                      close-on-click-action></van-action-sheet>
    <!--选择会员-->
    <div class="createIcon" @click="screenMember" v-if="status=='0'">
      <div class="iconfont icon-zhifeiji"></div>
      <div class="text">发送</div>
    </div>
    <van-cell-group style="margin-top: 10px;">
      <van-cell title="名称" :value="coupon.couponName"></van-cell>
      <van-cell title="备注" :value="coupon.remark"></van-cell>
    </van-cell-group>
    <van-sticky :offset-top="30">
      <div class="list_header" v-if="status=='0'">
        <div class="list_box">
          <span class="list_name" style="margin-right: 10px;">会员列表</span>
          <span class="list_name">(已选
            <span style="color: #f00;">{{selectMember.length}}</span> 人)
          </span>
          <van-button type="default" class="select" size="small" @click="chongzhi" v-if="!vipMobile" style="right: 80px;">清空</van-button>
          <van-button type="default" class="select" size="small" @click="select" v-if="!vipMobile">筛选</van-button>
          <!--<yd-checkbox v-model="isCheckAll" shape="circle" :change="checkAll" class="all"-->
          <!--color="#4F77AA">全选-->
          <!--</yd-checkbox>-->
        </div>
      </div>
    </van-sticky>

    <div class="mm-content" v-if="status=='0'">
      <div class="go_or_down_list">
        <template v-if="list.length !==0">
          <div class="list_main">
            <yd-checklist align="right" color="#4F77AA" v-model="selectMember" ref="checklistDemo"
                          :callback="storePeopleChange">
              <yd-checklist-item v-for="vip in list" :val="vip.vipNum" style="border-bottom:1px solid #e9e6e6;">
                <div class="list_item" style="border-bottom: none;">
                  <div class="img">
                    <img
                      v-if="vip.vipType==='积分卡'"
                      style="height: 100%;width: 100%"
                      src="@/assets/image/1-1.jpg"
                    />
                    <img
                      v-else-if="vip.vipType==='黄金卡'"
                      style="height: 100%;width: 100%"
                      src="@/assets/image/2-2.jpg"
                    />
                    <img
                      v-else
                      style="height: 100%;width: 100%"
                      src="@/assets/image/3-3.jpg"
                    />
                  </div>
                  <div class="list_item_content">
                    <p>{{vip.vipName}}</p>
                    <p>
                      <span>手机号：</span>
                      <span>{{vip.vipMobile}}</span>
                    </p>
                    <p>
                      <span>会员级别：</span>
                      <span>{{vip.vipType}}</span>
                    </p>
                  </div>
                </div>
              </yd-checklist-item>
            </yd-checklist>
          </div>
        </template>
        <template v-else>
          <div class="noData">
            暂无数据
          </div>
        </template>
      </div>
      <yd-backtop bottom="140px"></yd-backtop>
    </div>
  </main>
  </body>
</template>

<script>
  import { vipList } from '@/api/vip/index';
  import { couponList, sendCoupon } from '@/api/coupon/index';

  export default {
    name: 'couponDetail',
    data() {
      return {
        status: 0,
        index: 0,
        coupon: {},
        number: 0,
        list: [],//被选择的会员列表
        selectMember: [],//勾选的会员
        arr: [],
        //会员列表
        type: 1,
        vipMobile: '',
        pageNumber: 1,
        pageSize: 5,
        selectDate: [],
        selectCard: [],
        nowDate: '',
        total: 0,

        show: false,
        actions: [
          { name: '选择会员' },
          { name: '发券' },
          { name: '重置' },
        ],
        isCheckAll: false,
        isFirstEender: false,
      };
    },
    created() {
      this.actions = [
        { name: '选择会员' },
        { name: '发券' },
        { name: '重置' },
      ];
      this.index = this.$route.query.index;
      this.status = this.$route.query.status;
      this.getCouponList();
      //个人信息
      this.vipMobile = this.$route.query.vipMobile;
      if (this.vipMobile) {
        this.getVipList();
        this.actions = [
          { name: '发券' },
        ];
      }
      this.list = JSON.parse(window.localStorage.getItem('list')) || [];
      if (this.list.length !== 0) {
        this.isCheckAll = true;
        this.list.forEach(item => {
          this.selectMember.push(item.vipNum);
        });
      }
    },
    beforeRouteEnter(to, from, next) {
      if (from.name == 'couponList') { // 如果是从明细页过来则不需要刷新
        localStorage.removeItem('list');
      }
      next();
    },
    activated() {
      if (!this.$route.meta.isBack || this.isFirstEender) {
        this.actions = [
          { name: '选择会员' },
          { name: '发券' },
          { name: '重置' },
        ];
        this.index = this.$route.query.index;
        this.status = this.$route.query.status;
        this.getCouponList();
        this.vipMobile = this.$route.query.vipMobile;
        if (this.vipMobile) {
          this.getVipList();
          this.actions = [
            { name: '发券' },
          ];
        }
        let query = this.$route.query.list;

        localStorage.removeItem('list');
        if (!query) {
          this.list = [];
          this.selectMember = [];
        }

        if (query) {
          // localStorage.removeItem('list');
          this.list = this.list.concat(JSON.parse(query));
          let result = [];
          let obj = {};
          //去重
          for (let i = 0; i < this.list.length; i++) {
            if (!obj[this.list[i].vipNum]) {
              result.push(this.list[i]);
              obj[this.list[i].vipNum] = true;
            }
          }
          this.list = result;
          window.localStorage.setItem('list', JSON.stringify(this.list));
        }
        this.selectMember = [];
        if (this.list.length !== 0) {
          this.isCheckAll = true;
          this.list.forEach(item => {
            this.selectMember.push(item.vipNum);
          });
        }
      }
    },
    methods: {
      chongzhi() {
        this.list = [];
        this.selectMember = [];
        localStorage.removeItem('list');
        const { path } = this.$router.history.current;
        // console.log(path);
        this.$router.push({
          path,
          query: {
            status: this.status,
            index: this.index,
          },
        });
      },
      select(){
        //选择会员
        this.$router.push({
          name: 'screenMember',
          query: {
            status: this.status,
            index: this.index,
          }
        });
      },
      getCouponList() {
        couponList({
          storeId: this.storeId,
          status: this.status,
          recordCode: '',
        })
          .then(({ data }) => {
            if (data.length === 0) return;
            this.coupon = data[this.index];
          });
      },
      getVipList() {
        vipList({
          type: this.type,
          vipMobile: this.vipMobile,
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          storeId: this.storeId,
          birthdaysMonthList: this.selectDate,
          vipTypeList: this.selectCard,
          inDate: this.nowDate,
        })
          .then(({ data }) => {
            this.list = data.list;
            if (this.vipMobile) this.selectMember = [this.list[0].vipNum];
          });
      },
      //检查数组中是否包含特定的对象
      contains(a, id) {
        for (let i = 0; i < a.length; i++) {
          if (a[i] === id) {
            return true;
          }
        }
        return false;
      },
      screenMember() {
        //发券
        if (this.selectMember.length === 0) {
          this.$toast({
            message: '请选择会员',
            duration: 800,
          });
          return;
        }
        let arr = [];
        this.list.forEach((item) => {
          this.selectMember.forEach((a) => {
            if (item.vipNum == a) {
              let obj = {
                customerTel: item.vipMobile,
                vipCode: item.vipNum,
              };
              arr.push(obj);
            }
          });
        });
        sendCoupon({
          recordCode: this.coupon.recordCode,
          vipList: arr,
        })
          .then(({ msg }) => {
            this.$toast({
              message: `${msg}`,
              duration: 800,
            });
          });
      },
      onSelect(item) {
        if (item.name === '选择会员') {

        } else {
          //发券
          if (this.selectMember.length === 0) {
            this.$toast({
              message: '请选择会员',
              duration: 800,
            });
            return;
          }
          let arr = [];
          this.list.forEach((item) => {
            this.selectMember.forEach((a) => {
              if (item.vipNum == a) {
                let obj = {
                  customerTel: item.vipMobile,
                  vipCode: item.vipNum,
                };
                arr.push(obj);
              }
            });
          });
          sendCoupon({
            recordCode: this.coupon.recordCode,
            vipList: arr,
          })
            .then(({ msg }) => {
              this.$toast({
                message: `${msg}`,
                duration: 800,
              });
            });
        }
      },
      storePeopleChange(value, isCheckAll) {
        this.isCheckAll = isCheckAll;
      },
      checkAll() {
        this.isCheckAll = !this.isCheckAll;
        this.$refs.checklistDemo.$emit('ydui.checklist.checkall', this.isCheckAll);
      },
    }
  };
</script>

<style lang="scss">
  @import "@/assets/style/member-public.scss";
  @import "@/assets/style/work-public.scss";

  .van-cell {
    padding-top: vw(8);
    padding-bottom: vw(8);

    .van-cell__title {
      flex: 1
    }

    .van-cell__value {
      flex: 2;
    }
  }

  .yd-checklist-item:not(:last-child):after {
    border: 0.5px solid #e9e6e6
  }

  .yd-checklist-item {
    //border-bottom: 1px solid $border_color;
  }

  .all {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }

  .iconM {
    display: block;
    position: fixed;
    bottom: 10%;
    right: 10%;
    z-index: 1000;
    width: vw(60);
    height: vw(60);
    background-color: #4dbac0;
    color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.1);
    text-align: center;
    font-size: vw(35);
    line-height: vw(60);
  }

  .mm-content .go_or_down_list {
    margin-top: vw(0);
  }
</style>
