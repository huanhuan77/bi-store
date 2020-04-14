<template>
  <body>
  <!--<div class="member_search">-->
  <!--<span>会员名：</span>-->
  <!--<input type="text" class="input" placeholder="请输入会员名" v-model="input" @change="inputChange">-->
  <!--<van-button type="default" class="search_button" @click="search">查询</van-button>-->
  <!--</div>-->
  <storePerson :name="name" :names="names" @changeTab="changeTab"></storePerson>
  <van-button type="default" size="small" :class="[screen?'select screen':'select']"
              @click="filter">筛选
  </van-button>
  <template>
    <div class="table tableHead">
      <table border="0" cellspacing="0" cellpadding="0" rules="groups">
        <tbody>
        <tr>
          <td width="30%">会员手机</td>
          <td width="30%">优惠券码</td>
          <td width="20%">发券人</td>
          <td width="20%">是否使用</td>
        </tr>
        </tbody>
      </table>
    </div>
    <main id="#main">
      <div class="mm-content">
        <div class="table">
          <table border="0" cellspacing="0" cellpadding="0" rules="groups">
            <tbody>
            <van-list
              :offset="10"
              :immediate-check="true"
              v-model="loading"
              :finished="finished"
              finished-text=""
              @load="onLoad">
              <tr v-for="(item,index) in list" :key="index">
                <td width="30%">{{item.VipMobile}}</td>

                <td width="30%" style="color: rgb(15, 144, 210);" @click="toDetail(item.couponCode,item)"
                    v-if="!item.status">{{item.couponCode}}
                </td>
                <td width="30%" v-else></td>
                <td width="20%">{{item.sendBy}}</td>
                <td width="20%">{{item.isUse}}</td>
                <!--<td width="20%" v-if="!item.status" style="color: #04be02;">{{item.isUse}}</td>-->
                <!--<td width="20%" v-else style="color: #f00;">否</td>-->
                <!--<td width="10%" @click="showImage(item.couponCode,item)" v-if="!item.status">-->
                <!--<div class="iconfont icon-16erweima" style="color: #ccc;font-size: 18px;"></div>-->
                <!--</td>-->
              </tr>
            </van-list>
            </tbody>
          </table>
          <div class="noData" v-show="list.length===0">
            暂无数据
          </div>
        </div>
      </div>
      <yd-backtop></yd-backtop>
    </main>
  </template>

  <!--<van-popup v-model="show">-->
  <!--<img :src="imageSrc" alt="" class="image">-->
  <!--</van-popup>-->

  <!--<van-popup v-model="show" round :style="{ width:'80%' }">-->
  <!--<div class="imageBox" style="display: flex;flex-direction: column;justify-content: space-around">-->
  <!--<div class="user">-->
  <!--<span>{{userInfo.VipName}}</span>-->
  <!--&lt;!&ndash;<span>{{userInfo.VipMobile}}</span>&ndash;&gt;-->
  <!--</div>-->
  <!--<img :src="imageSrc" class="image" alt="" style="width: 100%;">-->
  <!--&lt;!&ndash;<div class="user">&ndash;&gt;-->
  <!--&lt;!&ndash;<span>{{userInfo.couponCode}}</span>&ndash;&gt;-->
  <!--&lt;!&ndash;</div>&ndash;&gt;-->
  <!--<van-icon name="close" class="closeIcon" @click="close"></van-icon>-->
  <!--</div>-->
  <!--</van-popup>-->

  <!--会员列表筛选-->
  <van-popup v-model="popShow" position="right" :style="{ height: '100%',width:'80%'}" @close="close">
    <div class="box">
      <van-cell style="background:#f4f4f4 ">筛选</van-cell>
      <div class="main">
        <van-cell>
          <input type="text" placeholder="请输入会员手机" class="input" v-model="vipMobile" style="margin-bottom: 8px;">
          <!--<span v-for="item in username" class="selectPeople">{{item}}</span>-->
        </van-cell>
        <van-cell v-show="!isPerson&&type!=4">
          <span type="text" class=" store">发券人 :</span>
          <div class="tagBox" v-if="username.length!==0" @click="showStorePeople">
            <van-tag
              v-show="!isPerson"
              v-for="(item,index) in username"
              :key="index"
              color="#4F77AA"
              size="medium"
              closeable
              @click.stop="selectClose(index)">
              {{item}}
            </van-tag>
          </div>
          <div v-else class="elseTagBox" @click="showStorePeople">
            选择发券人
          </div>
        </van-cell>
        <van-cell>
          会员等级：
        </van-cell>
        <van-cell>
          <yd-checklist v-model="selectCard"
                        class="checkbox"
                        color="#4F77AA">
            <yd-checklist-item :val="card.name" v-for="card in cardTypes" :key="card.value">
              <div>{{card.name}}</div>
            </yd-checklist-item>
          </yd-checklist>
        </van-cell>
        <van-cell>
          发券日期：
        </van-cell>
        <van-cell>
          <div class="time">
            <span class="dateInput" @click="showPopup1" style="display: inline-block;margin-right:10px;">{{sendStartDate||'开始日期'}}</span>
            <span class="dateInput" @click="showPopup2" style="display: inline-block;">{{sendEndDate||'结束日期'}}</span>
          </div>
        </van-cell>
      </div>
      <div class="bottom">
        <van-button size="small" id="reset" @click="reset">重置</van-button>
        <van-button type="info" size="small " @click="sure">确定</van-button>
      </div>
    </div>
  </van-popup>

  <!--时间组件-->
  <van-popup
    v-model="dateStartShow"
    position="bottom">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :formatter="formatter"
      @cancel="cancel1"
      @confirm="confirm1"></van-datetime-picker>
  </van-popup>
  <van-popup
    v-model="dateEndShow"
    position="bottom">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :formatter="formatter"
      @cancel="cancel2"
      @confirm="confirm2"></van-datetime-picker>
  </van-popup>

  <!--店铺人员列表-->
  <van-popup
    v-model="storeShow"
    :style="{ height: '50%' }"
    position="bottom">
    <div class="box">
      <div class="storeHeard">
        <span @click="storeShow=false">取消</span>
        <span @click="sureStore">确认</span>
      </div>
      <div class="main storeList">
        <van-checkbox-group v-model="selectStorePeople">
          <van-cell-group>
            <van-cell v-for="(item,index) in storePeopleList"
                      :key="index"
                      clickable
                      @click="toggle(index)">
              <van-checkbox :name="item.executorId" ref="checkboxes" slot="right-icon" checked-color="#4F77AA">
                <p>{{item.executorName}}</p>
                <p>工号：{{item.executorId}}</p>
              </van-checkbox>
            </van-cell>
          </van-cell-group>
          <!--<van-cell v-for="(item,index) in storePeopleList" :key="index" clickable-->
          <!--@click="selectStorePeople = item.executorId">-->
          <!--<p>{{item.executorName}}</p>-->
          <!--<p>工号：{{item.executorId}}</p>-->
          <!--<van-radio slot="right-icon" :name="item.executorId" checked-color="#4F77AA"></van-radio>-->
          <!--</van-cell>-->
        </van-checkbox-group>
      </div>
    </div>
  </van-popup>

  </body>
</template>

<script>
import axios from 'axios';
import baseURL from '../../../../../public/config/configUrl';
import { Loading } from 'vue-ydui/dist/lib.rem/dialog';
import { couponRecordsDetail, recordsDetial } from '@/api/coupon/index';
import storePerson from '@/components/store-person.vue';
import { storePeople } from '@/api/work';

export default {
  name: 'couponInfo',
  data() {
    return {
      input: '',
      pageSize: 10,
      pageNumber: 1,
      recordCode: '',

      loading: false,
      finished: false,
      list: [],
      total: 0,
      show: false,
      imageSrc: '',

      userInfo: {},
      token: window.localStorage.getItem('token'),
      names: {
        storeName: '店铺',
        personName: '个人',
      },
      name: '',
      type: '',
      username: [],

      screen: false,
      // 筛选
      popShow: false,
      vipMobile: '',
      selectCard: [],
      cardTypes: [
        {
          value: 1,
          name: '铂金卡',
        },
        {
          value: 2,
          name: '黄金卡',
        },
        {
          value: 3,
          name: '积分卡',
        }],
      selectDate: '',

      sendStartDate: '',
      dateStartShow: false,

      sendEndDate: '',
      dateEndShow: false,


      dateShow: false,
      currentDate: new Date(),

      isPerson: false,
      storePeopleList: [], // 店铺列表
      storeShow: false,
      selectStorePeople: [], // 发券人数组
      selectName: '',
    };
  },
  components: {
    storePerson,
  },
  created() {
    this.recordCode = this.$route.query.recordCode;
    this.type = window.localStorage.getItem('type');
    if (this.type != 4) {
      this.name = 'store';
      this.username = [];
    } else {
      this.name = 'person';
      this.username = [window.localStorage.getItem('name')];
    }
    this.getCouponDetail();
  },
  methods: {
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    changeTab(name) {
      if (this.name === name) return;
      if (name === 'store') {
        this.name = 'store';
        this.username = [];
        this.isPerson = false;
        this.reset();
      } else if (name === 'person') {
        this.name = 'person';
        this.username = [window.localStorage.getItem('name')];
        this.isPerson = true;
        this.reset();
      }
    },
    search() {
      this.input = this.input.trim();
      if (this.input === '') {
        this.$toast({
          message: '请输入会员名',
          duration: 800,
        });
        return;
      }
      this.getCouponDetail();
    },
    inputChange() {
      if (this.input === '') this.getCouponDetail();
    },
    getCouponDetail() {
      couponRecordsDetail({
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        recordCode: this.recordCode,
        sendDate: this.nowDate,
        vipMobile: this.vipMobile,
        // userName: this.username,
        nameList: this.username, // 发券人
        vipTypeList: this.selectCard,
        sendStartDate: this.sendStartDate,
        sendEndDate: this.sendEndDate,
      })
        .then(({ data }) => {
          this.list = data.couponRecordsDetail;
          this.total = data.totalCount;
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
        });
    },
    getStoreList() {
      storePeople()
        .then(({ data }) => {
          this.storePeopleList = data.list;
        })
        .catch(() => {
          this.storePeopleList = [];
        });
    },
    onLoad() {
      if (this.list.length < this.pageSize) {
        this.loading = false;
        this.finished = true;
      } else {
        const { list } = this;
        setTimeout(() => {
          this.pageNumber += 1;
          couponRecordsDetail({
            pageSize: this.pageSize,
            pageNumber: this.pageNumber,
            recordCode: this.recordCode,
            sendDate: this.nowDate,
            vipMobile: this.vipMobile,
            nameList: this.username, // 发券人
            vipTypeList: this.selectCard,
            sendStartDate: this.sendStartDate,
            sendEndDate: this.sendEndDate,
          })
            .then(({ data }) => {
              this.loading = false;
              this.total = data.totalCount;
              this.list = list.concat(data.list);
              if (this.list.length >= data.totalCount) {
                this.finished = true;
              }
            });
        }, 500);
      }
    },
    toDetail(couponCode, item) {
      this.userInfo = item;
      this.$router.push({
        name: 'codeDetail',
        query: {
          couponCode,
          vipMobile: this.userInfo.VipMobile,
        },
      });
    },
    showImage(couponCode, item) {
      this.imageSrc = '';
      if (couponCode === '') {
        return;
      }
      Loading.open('加载中');
      axios({
        method: 'get',
        url: `${baseURL.apiUrl}vip/getBarCode`,
        params: {
          couponCode,
        },
        responseType: 'blob', // 改变接收的值类型
        headers: { Authorization: `Bearer ${this.token}` },
      })
        .then(({ data }) => {
          const src = window.URL.createObjectURL(data);// 这里也是关键,调用window的这个方法URL方法
          this.imageSrc = src;
          this.userInfo = item;
          this.show = true;
          Loading.close();
        })
        .catch(() => {
          this.$toast({
            message: '获取条形码失败！',
            type: 'fail',
            duration: 1000,
          });
          Loading.close();
          // console.log('获取条形码失败！')
        });
    },
    /**
       * Created by zyj on 2019-11-4
       * 筛选
       */
    filter() {
      this.popShow = true;
    },
    reset() {
      this.screen = false;
      this.selectCard = [];
      this.vipMobile = '';
      this.nowDate = '';
      this.sendEndDate = '';
      this.sendStartDate = '';
      if (!this.isPerson) {
        this.username = [];
      } else {
        this.username = [window.localStorage.getItem('name')];
      }
      this.getCouponDetail();
    },
    sure() {
      if (this.sendStartDate > this.sendEndDate) {
        this.$toast({
          message: '开始时间不能大于结束时间！',
        });
        this.sendEndDate = this.sendStartDate;
        return;
      }
      this.pageNumber = 1;
      document.getElementById('#main').scrollTop = 0;
      this.popShow = false;
      this.screen = true;
      this.getCouponDetail();
    },
    close() {
      if (!this.isPerson && this.type != 4) {
        if (this.vipMobile === '' && this.sendStartDate === '' && this.sendEndDate === ''
            && this.selectCard.length === 0 && this.username.length === 0) {
          this.screen = false;
          return;
        }
      } else if (this.vipMobile === '' && this.sendStartDate === ''
            && this.sendEndDate === '' && this.selectCard.length === 0) {
        this.screen = false;
        return;
      }
      this.sure();
    },
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
    showPopup1() {
      this.dateStartShow = true;
    },
    cancel1() {
      this.dateStartShow = false;
    },
    confirm1(value) {
      this.dateStartShow = false;
      this.sendStartDate = value.format('yyyy-MM-dd');
    },

    showPopup2() {
      this.dateEndShow = true;
    },
    cancel2() {
      this.dateEndShow = false;
    },
    confirm2(value) {
      this.dateEndShow = false;
      this.sendEndDate = value.format('yyyy-MM-dd');
    },
    showStorePeople() {
      this.selectStorePeople = [];
      this.storePeopleList.forEach((item, index) => {
        this.username.forEach((a) => {
          if (a == item.executorName) {
            this.selectStorePeople.push(item.executorId);
          }
        });
      });
      this.storeShow = true;
      this.getStoreList();
    },
    sureStore() {
      this.username = [];
      this.storePeopleList.forEach((item, index) => {
        this.selectStorePeople.forEach((a) => {
          if (a == item.executorId) {
            this.username.push(item.executorName);
          }
        });
      });
      this.storeShow = false;
    },
    // 可关闭标签
    selectClose(index) {
      this.username.splice(index, 1);
    },
  },
};
</script>

<style scoped lang="scss">
  @import "@/assets/style/member-public.scss";

  .van-cell {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 0.26667rem 0.42667rem;
    overflow: hidden;
    color: #323233;
    font-size: 0.37333rem;
    line-height: 0.64rem;
    background-color: #fff;
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
    width: 100%;

    table {
      width: 100%;

      td {
        border-bottom: 1px solid $tableBorder;
        text-align: center;
        height: vw(36);
        line-height: vw(36);
        text-overflow: ellipsis;
        vertical-align: middle;
      }
    }
  }

  .van-list {
    width: 100%;

    tr {
      display: flex;
      /*width: 100%;*/
    }
  }

  .imageBox {
    padding: vw(20) vw(10) 0 vw(10);
    font-size: vw(16);

    .user {
      height: vw(40);
      line-height: vw(40);
      text-align: center;

      span {
        margin-right: vw(10);
      }
    }

    .image {
      width: 80%;
      height: 80%;
    }

  }


  .van-image {
    margin: auto 0;
  }

  .scanCode {
    text-align: center;
    color: #333;
    height: vw(40);
    line-height: vw(40);
  }

  .closeIcon {
    color: #ccc;
    font-size: vw(30);
    height: vw(60);
    line-height: vw(60);
    text-align: center;

  }

  .userName_popup {
    height: vw(60);
    line-height: vw(60);
    display: flex;

    .van-image {
      margin-left: vw(15);
      margin-right: vw(15);
    }
  }

  /*筛选*/
  .select {
    position: absolute;
    top: vw(57);
    transform: translateY(-50%);
    right: vw(10);
    border: 1px solid $theme-color;
    color: $theme-color;
    border-radius: vw(6);
    line-height: 22px;
    font-size: vw(14);
  }

  .bottom {
    padding: 0 vw(10);
  }

  .store {
    display: block;
    color: #323233;
    padding: vw(5) 0;
  }

  .tagBox {
    width: 100%;
    background-color: #F7F8FA;
    padding: vw(6) vw(10);
  }

  .elseTagBox {
    width: 100%;
    background-color: #F7F8FA;
    height: vw(40);
    color: #888;
    padding: vw(6) vw(10);
  }

  .storeHeard {
    font-weight: 700;
    min-height: vw(40);
    line-height: vw(40);
    border-bottom: 1px solid $body_background_color;
    padding-left: vw(10);
    font-size: vw(14);

    span {
      width: vw(60);
      text-align: center;
      font-weight: 400;
      color: #0198ff;
    }

    span:first-of-type {
      float: left;
    }

    span:last-of-type {
      float: right;
    }
  }

  .storeList {
    /*margin: vw(10) 0;*/

    .van-cell {
      padding: vw(5);

      .van-cell__title {
        padding-left: vw(20);
      }
    }

    p {
      padding-left: vw(20);
    }

    p:last-of-type {
      font-size: vw(12);
      color: #999;
    }
  }

  .selectPeople {
    display: inline-block;
    background-color: $theme-color;
    color: #fff;
    padding: vw(2) vw(6);
    border-radius: vw(6);
    margin: vw(4);
  }

  .van-tag {
    padding: vw(4) vw(10);
    margin: vw(4);
  }
</style>
