<template>
  <body>
  <div class="createIcon" v-show="dfp && store" @click="showStorePeoplePopup">
    <div class="iconfont icon-fenpei"></div>
    <div class="text">分配</div>
  </div>
  <storePerson :names="names" :name="name" @changeTab="changeTab"></storePerson>
  <main id="#main">
    <template v-if="store">
      <div class="totalBox">
        <span>会员合计：<i>{{vipData.totalQuantity}}</i>人</span>
        <span>
           <p v-for="(vip,index) in vipData.cardList" :key="index">
             <span>{{vip.vipType}}：</span>
             <span><i>{{vip.quantity}}</i></span>
           </p>
         </span>
      </div>

      <van-sticky :offset-top="offsetTop1">
        <div class="member_type">
          <div :class="{active:dfp}" @click="changeMemberType(1)">待分配会员</div>
          <div :class="{active:memberlist}" @click="changeMemberType(2)">会员列表</div>
          <yd-checkbox v-model="isCheckAll" shape="circle" :change="checkAll" v-show="dfp" class="all"
                       color="#4F77AA">全选
          </yd-checkbox>
        </div>
        <!--<div class="line"></div>-->
      </van-sticky>

      <van-sticky :offset-top="offsetTop2">
        <div v-if="memberlist" class="list_header" style="margin-top: 0;">
          <div class="list_box">
            <span class="list_name">会员列表</span>
            <span class="list_name">( {{assignedListTotal}}人 )</span>
            <van-button type="default" size="small" :class="[screenOne?'select screen':'select']"
                        @click="fiterAssignedList">筛选
            </van-button>
          </div>
        </div>
        <div v-else class="list_header" style="margin-top: 0;">
          <div class="list_box">
            <span class="list_name">待分配列表</span>
            <span class="list_name">( {{unAssignedListTotal}}人 )</span>
            <van-button type="default" size="small" :class="[screenTwo?'select screen':'select']"
                        @click="fiterUnassignedList">筛选
            </van-button>
          </div>
        </div>
      </van-sticky>

      <div class="mm-content">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" :success-duration=500>
          <van-list v-model="loading" :finished="finished" finished-text="" error-text="请求失败，点击重新加载"
                    :immediate-check="false" :offset="100"
                    @load="onLoad1">
            <!--会员列表-->
            <div class="go_or_down_list" style="margin-top: 0" v-if="memberlist">
              <template v-if="assignedList.length !==0">
                <div class="list_main">
                  <div class="list_item" v-for="(vip,index) in assignedList"
                       :key="index" @click="vipDetail(vip.vipMobile)">
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
                      <p><span>专属店员：</span><span>{{vip.empName|| '暂无'}}</span></p>
                    </div>
                  </div>
                </div>
                <!--<div class="list_more" v-if="isMore" @click="assignedListMore">-->
                <!--<span>查看更多</span>-->
                <!--<van-icon name="arrow"/>-->
                <!--</div>-->
                <!--<div class="noData" v-if="!isMore">-->
                <!--暂无数据-->
                <!--</div>-->
              </template>
              <template v-else>
                <div class="noData">
                  暂无数据
                </div>
              </template>
            </div>
            <!--待分配列表-->
            <div class="go_or_down_list dfp_list" v-if="dfp">
              <template v-if="unAssignedList.length !==0">
                <div class="list_main">
                  <yd-checklist align="right" color="#4F77AA" v-model="selectMember" ref="checklistDemo"
                                :callback="storePeopleChange" :label="false">
                    <yd-checklist-item v-for="(vip,index) in unAssignedList" :val="vip.vipNum">
                      <div class="list_item"
                           :key="index" @click="vipDetail(vip.vipMobile)">
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
                          <p><span>专属店员：</span><span>{{vip.empName || '暂无'}}</span></p>
                        </div>
                      </div>
                    </yd-checklist-item>
                  </yd-checklist>

                </div>
                <!--<div class="list_more" v-if="unIsMore" @click="unassignedListMore">-->
                <!--<span>查看更多</span>-->
                <!--<van-icon name="arrow"/>-->
                <!--</div>-->
                <!--<div class="noData" v-if="!unIsMore">-->
                <!--暂无数据-->
                <!--</div>-->
              </template>
              <template v-else>
                <div class="noData">暂无数据</div>
              </template>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>

    </template>

    <template v-else>
      <van-sticky :offset-top="offsetTop3">
        <div class="list_header">
          <div class="list_box">
            <span class="list_name">会员列表</span>
            <span class="list_name">( {{total}}人 )</span>
            <van-button type="default" size="small" :class="[myScreen?'select screen':'select']" @click="showPop">
              筛选
            </van-button>
          </div>
        </div>
      </van-sticky>
      <!--我的会员-->
      <div class="mm-content">
        <!--会员列表-->
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" :success-duration=500>
          <van-list v-model="loading" :finished="finished" finished-text="" error-text="请求失败，点击重新加载"
                    :immediate-check="false" @load="onLoad" :offset="10">
            <div class="go_or_down_list">
              <template v-if="list.length!=0">
                <div class="list_main">
                  <div class="list_item" v-for="(vip,index) in list" :key="index" @click="myVipDetail(vip.vipMobile)">
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
              </template>
              <template v-else>
                <div class="noData">
                  暂无数据
                </div>
              </template>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </template>

    <yd-backtop bottom="140px"></yd-backtop>
  </main>

  <!--会员列表筛选-->
  <van-popup v-model="show1" position="right" :style="{ height: '100%',width:'80%'}" @close="close1">
    <div class="box">
      <van-cell style="background:#f4f4f4 ">筛选</van-cell>
      <div class="main">
        <van-cell>
          <input type="text" placeholder="会员手机/导购姓名" class="input" v-model="vipMobile1">
        </van-cell>
        <van-cell>
          会员等级：
        </van-cell>
        <van-cell>
          <yd-checklist v-model="assignedSelectCard"
                        class="checkbox"
                        :callback="cardChange1"
                        color="#4F77AA">
            <yd-checklist-item :val="card.name" v-for="card in cardTypes" :key="card.value">
              <div>{{card.name}}</div>
            </yd-checklist-item>
          </yd-checklist>
        </van-cell>
        <van-cell>生日月份：</van-cell>
        <van-cell>
          <yd-checklist v-model="assignedSelectDate"
                        class="checkbox"
                        :callback="dateChange1"
                        color="#4F77AA">
            <yd-checklist-item :val="month.name" v-for="(month,index) in monthList" :key="index"
                               class="card_button">
              <div>{{month.name}}</div>
            </yd-checklist-item>
          </yd-checklist>
        </van-cell>
        <van-cell>入会日期：</van-cell>
        <van-cell>
          <div class="time">
            <span class="dateInput" @click="showPopup1" style="display: inline-block;">{{nowDate1||'选择日期'}}</span>
          </div>
        </van-cell>
      </div>
      <div class="bottom">
        <van-button size="small" id="reset" @click="reset1">重置</van-button>
        <van-button type="info" size="small " @click="sure1">确定</van-button>
      </div>
    </div>
  </van-popup>

  <!--  待分配列表-->
  <van-popup v-model="show2" position="right" :style="{ height: '100%',width:'80%'}" @close="close2">
    <div class="box">
      <van-cell style="background:#f4f4f4 ">筛选</van-cell>
      <div class="main">
        <van-cell>
          <input type="text" placeholder="会员手机/导购姓名" class="input" v-model="vipMobile2">
        </van-cell>
        <van-cell>
          会员等级：
        </van-cell>
        <van-cell>
          <yd-checklist v-model="unAssignedSelectCard"
                        class="checkbox"
                        :callback="cardChange2"
                        color="#4F77AA">
            <yd-checklist-item :val="card.name" v-for="card in cardTypes" :key="card.value">
              <div>{{card.name}}</div>
            </yd-checklist-item>
          </yd-checklist>
        </van-cell>
        <van-cell>生日月份：</van-cell>
        <van-cell>
          <yd-checklist v-model="unAssignedSelectDate"
                        class="checkbox"
                        :callback="dateChange2"
                        color="#4F77AA">
            <yd-checklist-item :val="month.name" v-for="(month,index) in monthList" :key="index"
                               class="card_button">
              <div>{{month.name}}</div>
            </yd-checklist-item>
          </yd-checklist>
        </van-cell>
        <van-cell>入会日期：</van-cell>
        <van-cell>
          <div class="time">
            <span class="dateInput" @click="showPopup2" style="display: inline-block;">{{nowDate2||'选择日期'}}</span>
          </div>
        </van-cell>
      </div>
      <div class="bottom">
        <van-button size="small" id="reset" @click="reset2">重置</van-button>
        <van-button type="info" size="small" @click="sure2">确定</van-button>
      </div>
    </div>
  </van-popup>

  <!--筛选-->
  <van-popup v-model="show" position="right" :style="{ height: '100%',width:'80%'}" @close="myClose">
    <div class="box">
      <van-cell style="background:#f4f4f4 ">筛选</van-cell>
      <div class="main">
        <van-cell>
          <input type="text" placeholder="请输入会员手机号" class="input" v-model="vipMobile">
        </van-cell>
        <van-cell>
          会员等级：
        </van-cell>
        <van-cell>
          <yd-checklist v-model="mySelectCard"
                        class="checkbox"
                        :callback="myCardChange"
                        color="#4F77AA">
            <yd-checklist-item :val="card.name" v-for="card in cardTypes" :key="card.value">
              <div>{{card.name}}</div>
            </yd-checklist-item>
          </yd-checklist>
          <!--<van-button plain hairline size="small" v-for="card in cardTypes" :key="card.value"-->
          <!--:class="[cardIndex==card.value ?'card_active':'']"-->
          <!--class="card_button" @click="selectType(card)"-->
          <!--&gt;{{card.name}}-->
          <!--</van-button>-->
        </van-cell>
        <van-cell>生日月份：</van-cell>
        <van-cell>
          <yd-checklist v-model="mySelectDate"
                        class="checkbox"
                        :callback="myDateChange"
                        color="#4F77AA">
            <yd-checklist-item :val="month.name" v-for="(month,index) in monthList" :key="index"
                               class="card_button">
              <div>{{month.name}}</div>
            </yd-checklist-item>
          </yd-checklist>
          <!--<van-button class="card_button" plain hairline size="small"-->
          <!--v-for="(month,index) in monthList" :key="index"-->
          <!--:class="[monthNum==month.name?'card_active':'']"-->
          <!--@click="selectMonth(month.name)"-->
          <!--&gt;{{month.name}}-->
          <!--</van-button>-->
        </van-cell>
        <van-cell>入会日期：</van-cell>
        <van-cell>
          <div class="time">
            <span class="dateInput" @click="myShowPopup" style="display: inline-block;">{{myNowDate||'选择日期'}}</span>
            <!--<input type="text" class="dateInput" placeholder="选择日期" @click="myShowPopup" :value="myNowDate">-->
          </div>
        </van-cell>
      </div>
      <div class="bottom">
        <van-button size="small" id="reset" @click="reset">重置</van-button>
        <van-button type="info" size="small " @click="sure">确定</van-button>
      </div>
    </div>
  </van-popup>

  <!--会员列表-->
  <van-popup
    v-model="dateShow1"
    position="bottom">
    <van-datetime-picker
      v-model="currentDate"
      type="year-month"
      :formatter="formatter"
      @cancel="cancel1"
      @confirm="confirm1"></van-datetime-picker>
  </van-popup>

  <!--待筛选-->
  <van-popup
    v-model="dateShow2"
    position="bottom">
    <van-datetime-picker
      v-model="currentDate"
      type="year-month"
      :formatter="formatter"
      @cancel="cancel2"
      @confirm="confirm2"></van-datetime-picker>
  </van-popup>

  <!--我的会员-->
  <van-popup
    v-model="myDateShow"
    position="bottom">
    <van-datetime-picker
      v-model="currentDate"
      type="year-month"
      :formatter="formatter"
      @cancel="myCancel"
      @confirm="myConfirm"></van-datetime-picker>
  </van-popup>

  <!--店员列表-->
  <van-popup v-model="showStorePeople" position="center"
             :style="{ height: '80%',width:'85%',borderRadius:'15px',background:'#F0F0F0'}">
    <div class="box">
      <p class="storeHeard">店员列表</p>
      <div class="main">
        <van-radio-group v-model="selectStorePeople">
          <van-cell v-for="(item,index) in storePeopleList" :key="index" @click="selectStorePeople = item.executorId">
            <p style="font-weight: bold">{{item.executorName}}</p>
            <p>工号：{{item.executorId}}</p>
            <van-radio slot="right-icon" :name="item.executorId" checked-color="#4F77AA"></van-radio>
          </van-cell>
        </van-radio-group>
      </div>
      <div class="bottom">
        <van-button type="default" class="button" @click="showStorePeople=false">取消</van-button>
        <van-button type='info' class="button" @click="sureStorePeople" :disabled="disabled">确认
        </van-button>
      </div>
    </div>
  </van-popup>

  </body>
</template>

<script>
import storePerson from '@/components/store-person.vue';
import {
  vipTotal, vipList, userVipList, assignMember,
} from '@/api/vip';
import { storePeople } from '@/api/work';
import { Toast } from 'vant';

export default {
  name: 'memberMain',
  components: {
    storePerson,
    Toast,
  },
  data() {
    return {
      fixed: false,
      distanceTop: 0,
      scroll: 0,
      names: {
        storeName: '店铺会员',
        personName: '我的会员',
      },
      typeIndex: 1,
      assignedList: [], // 会员列表
      unAssignedList: [], // 待分配会员列表
      vipData: {}, // 会员统计

      // 筛选
      show1: false,
      show2: false,
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
      cardIndex1: 0,
      cardIndex2: 0,
      cardName1: '',
      cardName2: '',
      vipMobile1: '',
      vipMobile2: '',

      // 会员列表分页
      assignedPageSize: 5,
      assignedPageNumber: 1,
      isMore: true,
      assignedListTotal: 0,

      // 待分配会员分页
      unassignedPageSize: 5,
      unassignedPageNumber: 1,
      unIsMore: true,
      unAssignedListTotal: 0,

      // 我的会员
      list: [],
      total: 0,
      pageNumber: 1,
      pageSize: 10,
      // 筛选
      show: false,
      cardIndex: 0,
      vipMobile: '',
      cardName: '',
      monthNum: '',
      isLoading: false,
      finished: false,
      loading: false,

      monthList: [
        {
          value: 1,
          name: '01',
        },
        {
          value: 2,
          name: '02',
        },
        {
          value: 3,
          name: '03',
        },
        {
          value: 4,
          name: '04',
        },
        {
          value: 5,
          name: '05',
        },
        {
          value: 6,
          name: '06',
        },
        {
          value: 7,
          name: '07',
        },
        {
          value: 8,
          name: '08',
        },
        {
          value: 9,
          name: '09',
        },
        {
          value: 10,
          name: '10',
        },
        {
          value: 11,
          name: '11',
        },
        {
          value: 12,
          name: '12',
        }],
      monthNum1: '',
      monthNum2: '',

      store: true,
      name: '',
      type: '',

      currentDate: new Date(),

      dateShow1: false,
      nowDate1: '',

      dateShow2: false,
      nowDate2: '',

      myDateShow: false,
      myNowDate: '',

      dfp: true, // 待分配列表类名
      memberlist: false, // 会员列表类名

      showStorePeople: false, // 店员弹框
      storePeopleList: [], // 店员列表
      selectStorePeople: '', // 选择店员
      selectMember: [], // 选择会员
      isCheckAll: false, // 是否全选
      dfpLoading: false, // 待分配加载中
      dfpFinished: false, // 待分配结束
      memberLoading: false, // 会员列表加载中
      memberFinished: false, // 会员列表结束
      disabled: false,

      assignedSelectCard: [], // 选择会员等级
      assignedSelectDate: [], // 选择月份
      unAssignedSelectCard: [],
      unAssignedSelectDate: [],
      mySelectCard: [],
      mySelectDate: [],

      isCheckCard1: false, // 是否选中
      isCheckDate1: false, // 是否选中

      isCheckCard2: false, // 是否选中
      isCheckDate2: false, // 是否选中

      myIsCheckCard: false, // 是否选中
      myIsCheckDate: false, // 是否选中

      screenOne: false,
      screenTwo: false,
      myScreen: false,

      isFirstEender: false, // 是否第一次进入

      offsetTop1: 0,
      offsetTop2: 0,
      offsetTop3: 0,
    };
  },
  created() {
    this.type = window.localStorage.getItem('type');
    if (this.type != 4) {
      this.name = 'store';
      this.store = true;
      this.getVipList(); // 会员合计
    } else {
      this.name = 'person';
      this.store = false;
      this.getList();// 我的会员
    }
    this.isFirstEender = true;
  },
  mounted() {
    if (this.store) {
      this.offsetTop1 = document.getElementsByClassName('headerBox')[0].offsetHeight;
      this.offsetTop2 = this.offsetTop1 + document.getElementsByClassName('member_type')[0].offsetHeight;
    }
    this.offsetTop3 = document.getElementsByClassName('headerBox')[0].offsetHeight + document.getElementsByClassName('buttomItem')[0].offsetHeight - 10;
    const main = document.getElementById('#main');
    main.addEventListener('scroll', this.handleScroll);
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == 'memberDetail') {
      to.meta.isBack = true;
    }
    next();
  },
  activated() {
    if (!this.$route.meta.isBack || this.isFirstEender) {
      this.pageNumber = 1;

      if (this.type != 4) {
        this.name = 'store';
        this.store = true;
        this.reset1();
        this.reset2();
      } else {
        this.name = 'person';
        this.store = false;
        this.reset();
      }
    } else {
      const main = document.getElementById('#main');
      if (this.scroll > 0) {
        main.scrollTo(0, this.scroll);
        this.scroll = 0;
        main.addEventListener('scroll', this.handleScroll());
      }
    }
    this.$route.meta.isBack = false;
    this.isFirstEender = false;
  },
  watch: {
    $route(to, from) {
      // 如果是从详情页返回来,清空用户的选择
      if (from.name == 'memberDetail') {
        this.selectMember = [];
      }
    },
  },
  methods: {
    handleScroll() {
      const main = document.getElementById('#main');
      this.scroll = main.scrollTop;
      this.fixed = this.scroll > this.distanceTop;
    },
    // 会员列表
    showPopup1() {
      this.dateShow1 = true;
    },
    cancel1() {
      this.dateShow1 = false;
    },
    confirm1(value) {
      this.dateShow1 = false;
      this.nowDate1 = value.format('yyyy-MM');
    },
    // 待分配会员
    showPopup2() {
      this.dateShow2 = true;
    },
    cancel2() {
      this.dateShow2 = false;
    },
    confirm2(value) {
      this.dateShow2 = false;
      this.nowDate2 = value.format('yyyy-MM');
    },
    // 我的会员
    myShowPopup() {
      this.myDateShow = true;
    },
    myCancel() {
      this.myDateShow = false;
    },
    myConfirm(value) {
      this.myDateShow = false;
      this.myNowDate = value.format('yyyy-MM');
    },

    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    changeTab(name) {
      if (this.name == name) return;
      if (name == 'store') {
        this.finished = false;
        this.name = 'store';
        this.store = true;
        const main = document.getElementById('#main');
        main.scrollTop = 0;
        this.getVipList(); // 会员合计
      } else if (name == 'person') {
        this.finished = false;
        this.name = 'person';
        this.store = false;
        this.pageNumber = 1;
        const main = document.getElementById('#main');
        main.scrollTop = 0;
        this.getList();// 我的会员
      }
    },
    onRefresh() {
      this.isLoading = true;
      this.finished = false;
      if (this.name == 'store') {
        this.unassignedPageNumber = 1;
        this.assignedPageNumber = 1;
        this.reset1();
        this.reset2();
      } else {
        this.pageNumber = 1;
        this.reset();
      }
    },
    getVipList() {
      vipTotal()
        .then((res) => {
          this.isLoading = false;

          this.vipData = res.data.vipData;
          this.assignedList = res.data.assignedList;
          this.assignedListTotal = res.data.assigneTotal;
          this.assignedPageNumber = 1;
          if (this.assignedList.length >= this.assignedList) {
            this.isMore = false;
          } else {
            this.isMore = true;
          }

          this.unassignedPageNumber = 1;
          this.unAssignedList = res.data.unAssignedList;
          this.unAssignedListTotal = res.data.unAssigneTotal;
          if (this.unAssignedList.length >= this.unAssignedList) {
            this.unIsMore = false;
          } else {
            this.unIsMore = true;
          }
        });
    },
    // 会员列表
    getAssignedList() {
      this.assignedPageNumber = 1;
      vipList({
        type: 1,
        pageSize: this.assignedPageSize,
        pageNumber: this.assignedPageNumber,
        vipMobile: this.vipMobile1,
        vipTypeList: this.assignedSelectCard,
        birthdaysMonthList: this.assignedSelectDate,
        inDate: this.nowDate1,
      })
        .then((res) => {
          this.isLoading = false;
          this.assignedList = res.data.list;
          this.assignedListTotal = res.data.totalCount;
          if (this.assignedList.length >= res.data.totalCount) {
            this.isMore = false;
          } else {
            this.isMore = true;
          }
        });
    },
    // 会员列表查看更多
    assignedListMore() {
      this.assignedPageNumber += 1;
      vipList({
        type: 1,
        pageSize: this.assignedPageSize,
        pageNumber: this.assignedPageNumber,
        vipMobile: this.vipMobile1,
        vipTypeList: this.assignedSelectCard,
        birthdaysMonthList: this.assignedSelectDate,
        inDate: this.nowDate1,
      })
        .then((res) => {
          this.isLoading = false;
          const { assignedList } = this;
          this.assignedList = assignedList.concat(res.data.list);
          if (this.assignedList.length >= res.data.totalCount) {
            this.isMore = false;
          } else {
            this.isMore = true;
          }
        });
    },
    // 会员详情
    vipDetail(vipMobile) {
      this.$router.push({
        name: 'memberDetail',
        query: {
          vipMobile,
          show: false,
          myMember: false,
        },
      });
    },
    myVipDetail(vipMobile) {
      this.$router.push({
        name: 'memberDetail',
        query: {
          vipMobile,
          show: false,
          myMember: true,
        },
      });
    },
    // 待分配会员
    getUnassignedList() {
      this.unassignedPageNumber = 1;
      vipList({
        type: 0,
        pageSize: this.unassignedPageSize,
        pageNumber: this.unassignedPageNumber,
        vipMobile: this.vipMobile2,
        vipTypeList: this.unAssignedSelectCard,
        birthdaysMonthList: this.unAssignedSelectDate,
        inDate: this.nowDate2,
      })
        .then((res) => {
          this.unAssignedList = res.data.list;
          this.unAssignedListTotal = res.data.totalCount;
          if (this.unAssignedList.length >= res.data.totalCount) {
            this.unIsMore = false;
          } else {
            this.unIsMore = true;
          }
        });
    },
    // 待分配会员查看更多
    unassignedListMore() {
      this.unassignedPageNumber += 1;
      vipList({
        type: 0,
        pageSize: this.unassignedPageSize,
        pageNumber: this.unassignedPageNumber,
        vipMobile: this.vipMobile2,
        vipTypeList: this.unAssignedSelectCard,
        birthdaysMonthList: this.unAssignedSelectDate,
        inDate: this.nowDate2,
      })
        .then((res) => {
          const { unAssignedList } = this;
          this.unAssignedList = unAssignedList.concat(res.data.list);
          if (this.unAssignedList.length >= res.data.totalCount) {
            this.unIsMore = false;
          } else {
            this.unIsMore = true;
          }
        });
    },
    changeType(id) {
      this.typeIndex = id;
      if (id == 1) {
      } else if (id == 2) {
        this.$router.push({ name: 'myMember' });
      }
    },
    /**
       * 会员列表筛选==================
       */
    fiterAssignedList() {
      this.show1 = true;
    },
    sure1() {
      this.assignedPageNumber = 1;
      this.show1 = false;
      this.screenOne = true;
      document.getElementById('#main').scrollTop = 0;
      this.getAssignedList();
    },
    close1() {
      this.screenOne = false;
      if (this.vipMobile1 == '' && this.assignedSelectCard.length == 0 && this.assignedSelectDate.length == 0 && this.nowDate1 == '') return;
      this.sure1();
    },
    reset1() {
      this.nowDate1 = '';
      this.cardIndex1 = 0;
      this.assignedSelectCard = [];
      this.assignedSelectDate = [];
      this.vipMobile1 = '';
      this.screenOne = false;
      this.getAssignedList();
    },
    // 选择会员等级
    cardChange1(value, isCheck) {
      this.isCheckCard1 = isCheck;
      this.assignedSelectCard = value;
    },
    // 选择月份
    dateChange1(value, isCheck) {
      this.isCheckDate1 = isCheck;
      this.assignedSelectDate = value;
    },
    /**
       * 待分配列表筛选===============
       */
    fiterUnassignedList() {
      this.show2 = true;
    },
    reset2() {
      this.nowDate2 = '';
      this.cardIndex2 = 0;
      this.unAssignedSelectCard = [];
      this.unAssignedSelectDate = [];
      this.vipMobile2 = '';
      this.screenTwo = false;
      this.getUnassignedList();
    },
    close2() {
      this.screenTwo = false;
      if (this.vipMobile2 == '' && this.unAssignedSelectCard.length == 0 && this.unAssignedSelectDate.length == 0 && this.nowDate2 == '') return;
      this.sure2();
    },
    sure2() {
      this.unassignedPageNumber = 1;
      this.show2 = false;
      this.screenTwo = true;
      document.getElementById('#main').scrollTop = 0;
      this.getUnassignedList();
    },
    // 选择会员等级
    cardChange2(value, isCheck) {
      this.isCheckCard1 = isCheck;
      this.unAssignedSelectCard = value;
    },
    // 选择月份
    dateChange2(value, isCheck) {
      this.isCheckDate1 = isCheck;
      this.unAssignedSelectDate = value;
    },

    /**
       * Created by zyj on 2019-9-2
       * 我的会员列表
       */
    getList() {
      userVipList({
        userCode: window.localStorage.getItem('iposUserid'),
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        vipMobile: this.vipMobile,
        vipTypeList: this.mySelectCard,
        birthdaysMonthList: this.mySelectDate,
        inDate: this.myNowDate,
      })
        .then((res) => {
          this.list = res.data.list;
          this.total = res.data.totalCount;
          this.isLoading = false;
          this.finished = false;
        });
    },
    showPop() {
      this.show = true;
    },
    selectType(card) {
      this.cardName = card.name;
      this.cardIndex = card.value;
    },
    myClose() {
      this.myScreen = false;
      if (this.vipMobile == '' && this.mySelectCard.length == 0 && this.mySelectDate.length == 0 && this.myNowDate == '') return;
      this.sure();
    },
    sure() {
      this.show = false;
      this.pageNumber = 1;
      this.list = [];
      this.myScreen = true;
      document.getElementById('#main').scrollTop = 0;
      this.getList();
    },
    reset() {
      this.myNowDate = '';
      this.vipMobile = '';
      this.mySelectCard = [];
      this.mySelectDate = [];
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
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            vipMobile: this.vipMobile,
            vipTypeList: this.mySelectCard,
            birthdaysMonthList: this.mySelectDate,
            inDate: this.myNowDate,
          })
            .then((res) => {
              this.loading = false;
              this.total = res.data.totalCount;
              this.list = list.concat(res.data.list);
              if (this.list.length >= res.data.totalCount) {
                this.finished = true;
                setTimeout(() => {
                  this.$toast({
                    message: '没有更多了',
                    duration: 800,
                  });
                }, 800);
              }
            });
        }, 500);
      }
    },
    // 店铺会员加载
    onLoad1() {
      // console.log(this.finished);
      if (this.memberlist) {
        if (this.assignedList.length < this.assignedPageSize) {
          this.loading = false;
          this.finished = true;
        } else {
          const { assignedList } = this;
          setTimeout(() => {
            this.assignedPageNumber += 1;
            vipList({
              type: 1,
              pageSize: this.assignedPageSize,
              pageNumber: this.assignedPageNumber,
              vipMobile: this.vipMobile1,
              vipTypeList: this.assignedSelectCard,
              birthdaysMonthList: this.assignedSelectDate,
              inDate: this.nowDate1,
            })
              .then((res) => {
                this.loading = false;
                // this.total = res.data.totalCount;
                this.assignedList = assignedList.concat(res.data.list);
                if (this.assignedList.length >= res.data.totalCount) {
                  this.finished = true;
                  setTimeout(() => {
                    this.$toast({
                      message: '没有更多了',
                      duration: 800,
                    });
                  }, 800);
                }
              });
          }, 500);
        }
      } else if (this.dfp) {
        if (this.unAssignedList.length < this.unassignedPageSize) {
          this.loading = false;
          this.finished = true;
        } else {
          const { unAssignedList } = this;
          setTimeout(() => {
            this.unassignedPageNumber += 1;
            vipList({
              type: 0,
              pageSize: this.unassignedPageSize,
              pageNumber: this.unassignedPageNumber,
              vipMobile: this.vipMobile2,
              vipTypeList: this.unAssignedSelectCard,
              birthdaysMonthList: this.unAssignedSelectDate,
              inDate: this.nowDate2,
            })
              .then((res) => {
                this.loading = false;
                // this.total = res.data.totalCount;
                this.unAssignedList = unAssignedList.concat(res.data.list);
                if (this.unAssignedList.length >= res.data.totalCount) {
                  this.finished = true;
                  setTimeout(() => {
                    this.$toast({
                      message: '没有更多了',
                      duration: 800,
                    });
                  }, 800);
                }
              });
          }, 500);
        }
      }
    },
    selectMonth(name) {
      this.monthNum = name;
    },
    // 我的 选择会员等级
    myCardChange(value, isCheck) {
      this.myIsCheckCard = isCheck;
      this.mySelectCard = value;
    },
    // 我的 选择月份
    myDateChange(value, isCheck) {
      this.myIsCheckDate = isCheck;
      this.mySelectDate = value;
    },

    // 待分配  会员列表
    changeMemberType(index) {
      const main = document.getElementById('#main');
      main.scrollTop = 0;
      this.finished = false;
      if (index == 1) { // 未分配
        this.dfp = true;
        this.memberlist = false;
        this.reset2();
      } else {
        this.dfp = false;
        this.memberlist = true;
        this.reset1();
      }
    },
    // 分配弹框
    showStorePeoplePopup() {
      if (this.selectMember.length <= 0) {
        this.$toast('请选择会员!');
        return;
      }
      this.showStorePeople = true;
      this.getStorePeopleList();
      this.selectStorePeople = '';
    },
    // 店员列表
    getStorePeopleList() {
      storePeople()
        .then(({ data }) => {
          this.storePeopleList = data.list;
        });
    },

    // 确认分配
    sureStorePeople() {
      if (this.selectStorePeople == '') {
        this.$toast('请选择店员!');
        return;
      }
      Toast.loading({
        mask: false,
        message: '加载中...',
        duration: 0,
        forbidClick: true, // 禁用背景点击
      });
      this.disabled = true;
      assignMember({
        empId: this.selectStorePeople,
        vipNumList: this.selectMember,
      })

        .then(({ msg }) => {
          Toast.clear();
          Toast({
            duration: 800, // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            message: msg,
          });
          this.disabled = false;
          setTimeout(() => {
            this.showStorePeople = false;
          }, 900);

          this.getVipList();

          const main = document.getElementById('#main');
          main.scrollTop = 0;
          this.selectMember = [];
        });
    },
    // 选择会员
    storePeopleChange(value, isCheckAll) {
      this.isCheckAll = isCheckAll;
    },
    checkAll() {
      this.isCheckAll = !this.isCheckAll;
      this.$refs.checklistDemo.$emit('ydui.checklist.checkall', this.isCheckAll);
    },
  },
};
</script>

<style lang="scss">
  @import '@/assets/style/member-public.scss';
  @import "@/assets/style/work-public.scss";

  .totalBox {
    padding: vw(10);
    /*height: vw(70);*/
    background: #fff;
    margin: vw(8) 0;
    display: flex;
    font-size: vw(14);

    span {
      flex-grow: 1;
      margin: auto 0;

      i {
        color: $hong_color;
      }
    }

  }

  .member_type {
    background-color: #fff;
    display: flex;
    justify-content: center;
    position: relative;
    padding: vw(8) 0;

    div {
      width: vw(120);
      text-align: center;
      display: inline-block;
      height: vw(32);
      line-height: vw(32);
      border: 1px solid $theme-color;
      color: $theme-color;
      border-radius: vw(20) 0 0 vw(20);
      background-color: #fff;
    }

    div ~ div {
      border-left: none;
      border-radius: 0 vw(20) vw(20) 0;
    }

    .all {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }

    .yd-checkbox-text {
      color: $theme-color;
    }

    .active {
      color: #fff;
      background-color: $theme-color;
      //border-bottom: 2px solid $theme-color;
    }
  }

  .memberFixed {
    position: fixed;
    top: vw(40);
    left: 0;
    z-index: 999;
    width: 100%;
    background-color: #fff;
  }

  .listFixed {
    width: 100%;
    position: fixed;
    top: vw(70);
    left: 0;
    z-index: 999;
    margin-top: 0;
  }

  .cell {
    display: flex;
    justify-content: space-around;
  }

  .yd-checklist-item:not(:last-child):after {
    border: 0.5px solid #e9e6e6
  }

  .dfp_list {
    margin-top: 0 !important;

    .list_item {
      /*border-bottom: none !important;*/
    }

    .list_more {
      //border-top: 1px solid $border_color;
    }
  }

  .bottom {
    position: relative;

    .button {
      width: vw(80);
      height: vw(40);
      border-radius: vw(20);
      margin-left: vw(10);
      margin-top: vw(4);
      font-size: vw(16);
    }
  }

  .yd-checklist-item {
    margin-left: 0 !important;
  }

  .yd-checklist-item-icon {
    display: block !important;
  }

  .storeHeard {
    height: vw(30);
    line-height: vw(30);
    padding: 0 vw(20);

  }

  .yd-checklist-item {
    //border-bottom: 1px solid $border_color;
  }

  .line {
    width: 100%;
    height: vw(10);
    background-color: $body_background_color;
  }
</style>
