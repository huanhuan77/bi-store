<template>
  <body>
  <!--<HeaderBar></HeaderBar>-->
<!--  <MenuButton :typeIndex="typeIndex" :typeList="typeList" @changeType="changeType"></MenuButton>-->
  <storePerson :names="names" name="person" @changeTab="changeTab" ></storePerson>

  <main>
    <div class="mm-content">
      <!--会员列表-->
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" :success-duration=1000>
        <van-list  v-model="loading" :finished="finished" finished-text="没有更多了" error-text="请求失败，点击重新加载"
                   @load="onLoad"   :offset="0">
             <div class="go_or_down_list">
               <div class="list_header">
                 <span class="list_name">
                     <span style="color:#909399">会员列表</span>
                <span style="margin-left: 10px;">( {{total}}人 )</span>
                 </span>
                 <van-button type="default" size="mini" class="select" @click="showPop">筛选</van-button>
               </div>

                 <div class="list_main">
                   <div class="list_item" @click="toDetail(vip.vipMobile)" v-for="(vip,index) in list" :key="index">
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
                       <p><span>手机号：</span><span>{{vip.vipMobile}}</span></p>
                       <p><span>会员级别：</span><span>{{vip.vipType}}</span></p>
                     </div>
                   </div>
                 </div>
             </div>
           </van-list>
      </van-pull-refresh>

    </div>
  </main>

  <!--筛选-->
  <van-popup v-model="show" position="right"  :style="{ height: '100%',width:'80%'}">
    <div class="box">
      <van-cell style="background:#f4f4f4 ">筛选</van-cell>
      <div class="main">
        <van-cell>
          <input type="text" placeholder="请输入店铺" class="input" v-model="vipMobile">
          <!--           <van-button type="default" class="search_button" @click="search">查询</van-button>-->
        </van-cell>
        <van-cell>
          积分卡类型：
        </van-cell>
        <van-cell>
          <van-button plain hairline size="small" v-for="card in cardTypes" :key="card.value"
                      :class="[cardIndex==card.value ?'card_active':'']"
                      class="card_button"   @click="selectType(card)"
          >{{card.name}}</van-button>
        </van-cell>
        <van-cell>生日月份：</van-cell>
        <van-cell>
          <van-button class="card_button" plain hairline size="small"
                      v-for="(month,index) in monthList" :key="index"
                      :class="[monthNum==month.name?'card_active':'']"
                      @click="selectMonth(month.name)"
          >{{month.name}}
          </van-button>
        </van-cell>
      </div>
      <div class="bottom">
        <van-button  size="small" id="reset" @click="reset">重置</van-button>
        <van-button type="info" size="small " @click="sure">确定</van-button>
      </div>
    </div>
  </van-popup>
  </body>
</template>

<script>
import storePerson from '@/components/store-person.vue';
import { userVipList } from '@/api/vip';

export default {
  name: 'myMember',
  components: {
    storePerson,
  },
  data() {
    return {
      names: {
        storeName: '店铺会员',
        personName: '我的会员',
      },
      list: [],
      total: 0,
      pageNumber: 1,
      pageSize: 5,
      isMore: true,

      // 筛选
      show: false,
      // 筛选
      cardTypes: [
        { value: 1, name: '铂金卡' },
        { value: 2, name: '黄金卡' },
        { value: 3, name: '积分卡' }],
      cardIndex: 0,
      vipMobile: '',
      cardName: '',
      monthList: [
        { name: '01' },
        { name: '02' },
        { name: '03' },
        { name: '04' },
        { name: '05' },
        { name: '06' },
        { name: '07' },
        { name: '08' },
        { name: '09' },
        { name: '10' },
        { name: '11' },
        { name: '12' }],
      monthNum: '',

      isLoading: false,
      finished: false,
      loading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    changeTab(name) {
      name === 'person' ? this.$router.push({ name: 'myMember' }) : this.$router.push({ name: 'memberMain' });
    },
    getList() {
      userVipList({
        userCode: window.localStorage.getItem('iposUserid'),
        // userCode: '440114018_003',
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        vipMobile: this.vipMobile,
        vipType: this.cardName,
        birthdaysMonth: this.monthNum,

      })
        .then((res) => {
          this.list = res.data.list;
          this.total = res.data.totalCount;
          this.isLoading = false;
          this.finished = false;
        });
    },
    toDetail(vipMobile) {
      this.$router.push({
        name: 'memberDetail',
        query: { vipMobile },
      });
    },
    showPop() {
      this.show = true;
    },
    selectType(card) {
      this.cardName = card.name;
      this.cardIndex = card.value;
    },
    sure() {
      this.show = false;
      this.pageNumber = 1;
      this.list = [];
      this.getList();
    },
    reset() {
      this.vipMobile = '';
      this.cardName = '';
      this.cardIndex = 0;
      this.monthNum = '';
    },
    onRefresh() {
      this.pageNumber = 1;
      this.getList();
    },
    onLoad() {
      if (this.list.length < this.pageSize) {
        this.loading = false;
        this.finished = true;
      } else {
        const { list } = this;
        setTimeout(() => {
          this.pageNumber += 1;
          userVipList({
            userCode: window.localStorage.getItem('iposUserid'),
            // userCode: '440114018_003',
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            vipMobile: this.vipMobile,
            vipType: this.cardName,
            birthdaysMonth: this.monthNum,
          })
            .then((res) => {
              this.loading = false;
              this.total = res.data.totalCount;
              this.list = list.concat(res.data.list);
              if (this.list.length >= res.data.totalCount) {
                this.finished = true;
              }
            });
        }, 500);
      }
    },
    selectMonth(name) {
      this.monthNum = name;
    },
  },
};
</script>

<style lang="scss">
  @import '@/assets/style/member-public.scss';
</style>
