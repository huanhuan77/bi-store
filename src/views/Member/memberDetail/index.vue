<template>
  <body>
  <div class="createIcon" v-if="myMember&&!show||shop" @click="faquan">
    <div class="iconfont icon-youhuiquan1"></div>
    <div class="text">发券</div>
  </div>

  <div class="createIcon" v-if="memberIndex===2" @click="chaxun" style="bottom:20%">
    <div class="iconfont icon-chaxun1"></div>
    <div class="text">查询</div>
  </div>

  <div class="member_search" v-if="show">
    <span>手机号：</span>
    <input type="text" class="input" placeholder="请输入手机号" v-model="vipMobile" @keyup.enter="search">
    <van-button type="default" class="search_button" @click="search">查询</van-button>
  </div>

  <template v-if="vipData!=='' ">
    <main>
      <div class="member_info">
        <div class="img">
          <img
            v-if="vipData.vipType==='积分卡'"
            style="height: 100%;width: 100%"
            src="@/assets/image/1-1.jpg"
            alt=""/>
          <img
            v-else-if="vipData.vipType==='黄金卡'"
            style="height: 100%;width: 100%"
            src="@/assets/image/2-2.jpg"
          />
          <img
            v-else-if="vipData.vipType==='铂金卡'"
            style="height: 100%;width: 100%"
            src="@/assets/image/3-3.jpg"
          />
        </div>
        <div class="member_info_detail">
          <div class="nameLine">
            <div >姓名：</div>
            <div class="van-ellipsis name">{{vipData.vipName}}</div>
          </div>
          <p>
            <span>手机：</span>
            <span @click="call" style="color: #10AEFF">{{vipData.vipMobile}}</span>
          </p>
        </div>
        <div class="member_info_detail">
          <p>
            <span>会员等级：</span>
            <span>{{vipData.vipType}}</span>
          </p>
          <p>
            <span>可用积分：</span>
            <span>{{vipData.availableIntegral}}</span>
          </p>
        </div>
      </div>
      <van-sticky :offset-top="offsetTop">
        <MemberTypeButton :memberTypeList="typeList" :memberTypeIndex="memberIndex"
                          @changeMember="changeMember" style="margin-bottom:8px;" :isMember="true"></MemberTypeButton>
      </van-sticky>

      <!-- 消费明细 表头-->
      <div class="cost_item_header" v-if="memberIndex===3">
        <div class="table tableHead">
          <table border="0" cellspacing="0" cellpadding="0" rules="groups">
            <tbody>
            <tr>
              <td width="25%">日期</td>
              <td>单据编号</td>
              <td width="15%">数量</td>
              <td width="15%">金额</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!--优惠券 表头-->
      <div class="cost_item_header" v-if="memberIndex===2||memberIndex===5">
        <van-tabs v-model="tabs_active" :line-height="2" color="#4F77AA" title-active-color="#4F77AA"
                  @click="changeTab">
          <van-tab title="优惠券"></van-tab>
          <van-tab title="储值卡"></van-tab>
        </van-tabs>
        <div class="table tableHead" style="margin-top: 0;">
          <table border="0" cellspacing="0" cellpadding="0" rules="groups">
            <!--优惠券-->
            <tbody v-if="tabs_active==0">
            <tr>
              <td width="25%">优惠券号</td>
              <td>领取日期</td>
              <td width="20%">是否使用</td>
            </tr>
            </tbody>
            <!--储值卡-->
            <tbody v-if="tabs_active==1">
            <tr>
              <td width="25%">储值卡号</td>
              <td>累计消费金额</td>
              <td width="20%">当前余额</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mm-content">
        <!-- 详细资料-->
        <div class="detail" v-if="memberIndex===1">
          <div class="detail_item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-qiahao"></use>
            </svg>
            <span>会员卡号：</span>
            <span class="gray">{{tabList.vipNum}}</span>
          </div>
          <!--<div class="detail_item">-->
          <!--<svg class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-jifen3"></use>-->
          <!--</svg>-->
          <!--<span>会员级别：</span>-->
          <!--<span class="gray">{{tabList.vipType}}</span>-->
          <!--</div>-->
          <!--<div class="detail_item">-->
          <!--<svg class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-xingming"></use>-->
          <!--</svg>-->
          <!--<span>姓名：</span>-->
          <!--<span class="gray">{{tabList.vipName}}</span>-->
          <!--</div>-->
          <div class="detail_item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zu"></use>
            </svg>
            <span>性别：</span>
            <span class="gray">{{tabList.sex}}</span>
          </div>
          <!--<div class="detail_item">-->
          <!--<svg class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-shouji"></use>-->
          <!--</svg>-->
          <!--<span>手机：</span>-->
          <!--<span class="gray">{{tabList.vipMobile}}</span>-->
          <!--</div>-->
          <div class="detail_item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-chushengriqi"></use>
            </svg>
            <span>出生日期：</span>
            <span class="gray">{{tabList.vipBirthday}}</span>
          </div>
          <div class="detail_item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-leijixiaofeijine"></use>
            </svg>
            <span>累计消费金额：</span>
            <span class="gray">{{tabList.salesAmount}}</span>
          </div>
          <!--<div class="detail_item">-->
          <!--<svg class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-jifen1"></use>-->
          <!--</svg>-->
          <!--<span>可用积分：</span>-->
          <!--<span class="gray">{{tabList.availableIntegral}}</span>-->
          <!--</div>-->
          <div class="detail_item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-riqi"></use>
            </svg>
            <span>入会日期：</span>
            <span class="gray">{{tabList.createDate}}</span>
          </div>
          <div class="detail_item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-riqi"></use>
            </svg>
            <span>最近消费日期：</span>
            <span class="gray">{{tabList.lastDate}}</span>
          </div>

          <div class="detail_item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-icon-test"></use>
            </svg>
            <span>专属店员：</span>
            <span class="gray">{{tabList.empName}}</span>
          </div>

          <div class="detail_item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-yingxiaogongju-guanzhudianpuyouli"></use>
            </svg>
            <span style="display: inline-block;width:145px;">服务店铺名称：</span>
            <span class="gray">{{tabList.vipStore}}</span>
          </div>

        </div>
        <!--优惠券-->
        <div class="cost_detail" v-if="memberIndex===2 || memberIndex===5">
          <template v-if="tabList.length!==0">
            <van-list v-model="loading" :finished="finished" finished-text="" error-text="请求失败，点击重新加载"
                      :immediate-check="false" @load="onLoad" :offset="10">
              <div class="table">
                <table border="0" cellspacing="0" cellpadding="0" rules="groups">
                  <tbody v-if="memberIndex===2">
                  <tr v-for="(list,index) in tabList" :key="index">
                    <td width="25%" style="color: rgb(15, 144, 210);" @click="toDetail(list)">{{list.coupon_code}}</td>
                    <td>{{list.isAcceptTime}}</td>
                    <td width="20%" v-if="list.is_use=='已使用'" style="color: rgb(15, 144, 210);"
                        @click="couponDetail(list.coupon_code)">
                      {{list.is_use}}
                    </td>
                    <td width="20%" v-else>{{list.is_use}}</td>
                  </tr>
                  </tbody>
                  <tbody v-if="memberIndex===5">
                  <tr v-for="(list,index) in tabList" :key="index">
                    <td width="25%">{{list.czkNum}}</td>
                    <td>{{list.xfje}}</td>
                    <td width="20%">{{list.dqje}}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </van-list>
          </template>
          <template v-else>
            <div class="table_noData">暂无数据</div>
          </template>
        </div>
        <!-- 消费明细-->
        <div class="cost_detail" v-if="memberIndex===3">
          <template v-if="tabList.length!==0">
            <div class="table">
              <table border="0" cellspacing="0" cellpadding="0" rules="groups">
                <tbody>
                <tr v-for="(list,index) in tabList" :key="index">
                  <td width="25%">{{list.createDate}}</td>
                  <td style="color: #0F90D2" @click="toConsumeDetail(list.orderNum,list.storeId,list.storeName)">
                    {{list.orderNum}}
                  </td>
                  <td width="15%">{{list.orderQty}}</td>
                  <td width="15%">{{list.amount}}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template v-else>
            <div class="table_noData">暂无数据</div>
          </template>
        </div>
        <!--标签信息-->
        <div class="tagInfo " v-if="memberIndex===4">
          <!--编辑标签-->
          <div class="tag" v-if="memberIndex===4">
            <div class="editTag" @click="editTag" v-if="myMember && memberIndex===4">
              <span>编辑标签</span>
            </div>
            <div class="tagList" @click="tagList">
              <span>标签列表</span>
            </div>
          </div>
          <div class="outCircle">
            <div class="img">
              <img
                v-if="sex==='男'"
                style="height: 100%;width: 100%"
                src="@/assets/image/man.png"
              />
              <img
                v-if="sex==='女'"
                style="height: 100%;width: 100%"
                src="@/assets/image/woman.png"
              />
              <p class="age">{{age||18}}岁</p>
            </div>
          </div>
          <!--随机标签云-->
          <div class="wrap">
            <!--<svg :width='width' :height='height'>-->
            <!--<a href="#" v-for='(tag,index) in tags'>-->
            <!--<text :x='tag.x' :y='tag.y'-->
            <!--fill-opacity='1'-->
            <!--:fill="tag.color"-->
            <!--style="font-weight: 500;font-size:13px;"-->
            <!--@click="tagClick(index,tag.tag_name,tag.remark)">-->
            <!--{{tag.tag_name}}-->
            <!--</text>-->
            <!--</a>-->
            <!--</svg>-->
          </div>
          <div class="color">
            <span><i style="background-color: #ffa71e"></i>动态标签</span>
            <span><i style="background-color: #276fcc"></i>固定标签</span>
            <span><i style="background-color: #28ccb4"></i>自定义标签</span>
          </div>
          <!--动态标签-->
          <div class="dynamic" v-if="LabelList.length!=0">
            <ul>
              <li v-for="(item,index) in LabelList" :key="index" @click="tagClick(index,item.tag_name,item.remark)">
                {{item.tag_name}}
              </li>
            </ul>
          </div>
          <!--固定标签-->
          <div class="fixed" v-if="vipFixedTagList.length!=0">
            <ul>
              <li v-for="(item,index) in vipFixedTagList" :key="index">
                {{item.fixedTagName}}
              </li>
            </ul>
          </div>
          <!--自定义标签-->
          <div class="custom" v-if="vipDefinedList.length!=0">
            <ul>
              <li v-for="(item,index) in vipDefinedList" :key="index">
                {{item.tag}}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <yd-backtop bottom="200px"></yd-backtop>
    </main>
  </template>

  <van-popup v-model="showTags" position="bottom" :style="{ height: '80%' }" round @close="tagsClose">
    <div class="tagBox box">
      <div class="header">
        <van-cell>编辑会员标签</van-cell>
        <van-tabs v-model="active" color="#4F77AA" title-active-color="#4F77AA" :line-height="2">
          <van-tab title="选择固定标签"></van-tab>
          <van-tab title="自定义标签"></van-tab>
        </van-tabs>
      </div>
      <div class=" scroll main">
        <div class="tagItem" v-for="(item,index) in tagsList" v-show="active==0" :key="index">
          <div class="tagsLeft">
            {{item.name}} :
          </div>
          <div class="tagsRight">
            <li v-for="(check,index) in item.children" :key="index"
                :class="contains(checkbox, check.id,'fixedTagId')?'active':''"
                @click="checkTags(check.name,check.id)">{{check.name}}
            </li>
          </div>
        </div>
        <!--自定义标签-->
        <div v-show="active==1">
          <div class="member_search">
            <span>自定义：</span>
            <input type="text" class="input" placeholder="请输入标签" v-model="input">
            <van-button type="default" class="search_button" @click="sureDefined">添加</van-button>
          </div>
          <div class="definedList">
              <span v-for="(item,index) in definedLabel" :key="index">
                {{item.tag}}
                <van-icon name="close" @click="closeTags(index)"></van-icon>
              </span>
          </div>
        </div>
      </div>
      <van-button color="#4F77AA" size="large" @click="submitTags" class="tagsButton">保存</van-button>
    </div>
    <van-icon name="close" class="closeIcon" @click="closePopup1"></van-icon>
  </van-popup>

  <!--标签列表-->
  <van-popup v-model="showList" position="bottom" :style="{ height: '80%' }" round>
    <div class="tagBox box">
      <div class="listHeader">
        <van-cell>会员标签列表</van-cell>
      </div>
      <div class=" scroll main">
        <div class="tagItem">
          <div class="tagsLeft">
            动态标签 :
          </div>
          <div class="tagsRight">
            <li v-for="(item,index) in LabelList" :key="index">
              {{item.tag_name}}
            </li>
          </div>
        </div>
        <div class="tagItem">
          <div class="tagsLeft">
            固定标签 :
          </div>
          <div class="tagsRight">
            <li v-for="(item,index) in vipFixedTagList" :key="index">
              {{item.fixedTagName}}
            </li>
          </div>
        </div>
        <div class="tagItem">
          <div class="tagsLeft">
            自定义标签 :
          </div>
          <div class="tagsRight">
            <li v-for="(item,index) in vipDefinedList" :key="index">
              {{item.tag}}
            </li>
          </div>
        </div>
      </div>
    </div>
    <van-icon name="close" class="closeIcon" @click="closePopup2"></van-icon>
  </van-popup>

  <van-dialog
    v-model="showSearch"
    title="查询优惠券"
    show-cancel-button
    close-on-click-overlay
    :before-close="beforeClose"
    @cancel="cancel"
    @confirm="confirm">
    <div class="multiple_add">
      <input type="text"
             v-model="searchInput"
             placeholder="请输入优惠券名称"
             @keyup.enter="confirm"
             style="width: 100%;height: 100%;padding: 0;"/>
    </div>
  </van-dialog>

  <!--展示弹出层-->
  <van-popup v-model="showTel" class="callTel" round>
    <div>
      <a :href='`tel:${vipData.vipMobile}`'>
        <van-icon name="phone-o"></van-icon>
        呼叫</a>
      <a :href='`sms:${vipData.vipMobile}`'>
        <van-icon name="comment-o"></van-icon>
        发送短信</a>
    </div>
  </van-popup>

  </body>
</template>

<script>
import MemberTypeButton from '@/components/member-type-button.vue';
import {
  vipDetail,
  vipLabel,
  fixedVipLabel,
  updFixedVipLabel, // 编辑固定标签
  updDefinedVipLabel,
} from '@/api/vip';

export default {
  name: 'memberDetail',
  components: {
    MemberTypeButton,
  },
  data() {
    return {
      typeList: [
        {
          value: 1,
          name: '详细资料',
          icon: 'icon-xiangxiziliao',
        },
        {
          value: 2,
          name: '优惠/储值',
          icon: 'icon-youhuiquan',
        },
        {
          value: 3,
          name: '消费明细',
          icon: 'icon-xiaofei',
        },
        {
          value: 4,
          name: '标签信息',
          icon: 'icon-biaoqian',
        },
      ],
      tabs_active: 0, // 优惠券  储值卡
      memberIndex: 1,
      pageNumber: 1,
      pageSize: 15,
      vipMobile: '',
      vipData: '',
      tabList: [],
      tabListLength: 0, // 表格长度

      width: 0, // svg宽度
      height: 0, // svg高度
      tagsNum: 6, // 标签数量
      RADIUS: 0, // 球的半径
      tags: [],
      tagsText: [],
      tagRemark: [],

      isFirstEender: false, // 是否第一次进入
      sex: '',
      age: 18,
      showTags: false,
      active: 0, // 标签

      tagsList: [], // 标签列表
      checkbox: [], // 已选中得列表
      input: '', // 自定义标签
      empId: window.localStorage.getItem('iposUserid'),

      LabelList: [], // 动态标签
      vipFixedTagList: [], // 固定标签
      vipDefinedList: [], // 自定义标签

      vipNum: '',
      definedLabel: [], // 自定义标签

      showList: false, // 标签列表
      showTel: false,

      myMember: false,
      show: false, // 是否显示查询

      shop: false,
      loading: false,
      finished: false,
      total: 0,
      offsetTop: 0,

      showSearch: false,
      searchInput: '',
      flag: false,
    };
  },
  created() {
    this.show = JSON.parse(this.$route.query.show);
    this.memberIndex = this.$route.query.memberIndex ? Number(this.$route.query.memberIndex) : 1;// 从会员标签维护页进来直接显示标签信息
    if (this.$route.query.vipMobile) this.vipMobile = this.$route.query.vipMobile;
    if (this.$route.query.shop) this.shop = this.$route.query.shop;
    if (!this.show) {
      if (this.$route.query.myMember) this.myMember = JSON.parse(this.$route.query.myMember);
      this.getVipDetail();
    }
    this.isFirstEender = true;
    // 只有第一次进入或者刷新页面后才会执行此钩子函数
    // 使用keep-alive后（2+次）进入不会再执行此钩子函数
    // console.log(this.myMember);
  },
  updated() {
    this.sex = window.localStorage.getItem('sex');

  },
  // 判断从哪个页面过来
  beforeRouteEnter(to, from, next) {
    if (from.name === 'consumeDetail' || from.name === 'codeDetail') { // 如果是从明细页过来则不需要刷新
      to.meta.isBack = true;
    }
    next();
  },
  // 因为这个页面需要缓存。
  // 只有第一次进入时才会执行created和mounted方法，再次进入就不执行了。而activated每次进入都执行，所以在这个钩子函数中获取数据。
  activated() {
    if (!this.$route.meta.isBack || this.isFirstEender) {
      // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
      // 字符串的true和布尔类型的true不一样
      this.vipData = '';
      this.tabList = [];
      // this.memberIndex = 1;
      this.memberIndex = this.$route.query.memberIndex ? Number(this.$route.query.memberIndex) : 1; // 从会员标签维护页进来直接显示标签信息

      this.LabelList = [];
      this.vipFixedTagList = [];
      this.vipDefinedList = [];
      this.vipMobile = '';
      this.searchInput = '';
      this.myMember = false;
      if (this.$route.query.vipMobile) this.vipMobile = this.$route.query.vipMobile;
      if (this.$route.query.shop) {
        this.shop = this.$route.query.shop;
      } else {
        this.shop = false;
      }
      this.show = JSON.parse(this.$route.query.show);
      if (!this.show) {
        if (this.$route.query.myMember) this.myMember = JSON.parse(this.$route.query.myMember);
        this.getVipDetail();
      }
    }
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    this.$route.meta.isBack = false;
    this.isFirstEender = false;
  },
  mounted() {
    this.offsetTop = document.getElementsByClassName('headerBox')[0].offsetHeight;
    document.body.addEventListener('focusout', () => {
      setTimeout(() => {
        const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 100);
    });
  },

  methods: {
    call() {
      this.showTel = true;
    },
    tagClick(index, text, remark) {
      if (!remark) return;
      this.$toast({
        message: `${text} --- ${remark}`,
        duration: 2000,
      });
    },
    getvipLabel() {
      vipLabel({
        customerCode: this.vipData.customerCode,
      })
        .then(({ data }) => {
          this.LabelList = data.LabelList;
          this.vipFixedTagList = data.vipFixedTagList;
          this.vipDefinedList = data.vipDefinedList;
          this.checkbox = this.vipFixedTagList;
          this.definedLabel = this.vipDefinedList;
        })
        .catch(() => {
          this.LabelList = [];
          this.vipFixedTagList = [];
          this.vipDefinedList = [];
        });
    },
    changeTab(name, title) {
      this.pageNumber = 1;
      if (title == '储值卡') {
        this.memberIndex = 5;
        this.getVipDetail();
      } else {
        this.memberIndex = 2;
        this.getVipDetail();
      }
    },
    changeMember(id) {
      if (this.memberIndex === id) return;
      this.memberIndex = id;
      this.pageNumber = 1;
      this.LabelList = [];
      this.vipFixedTagList = [];
      this.vipDefinedList = [];
      this.tabs_active = 0;
      this.finished = false;
      this.getVipDetail();
    },
    getVipDetail() {
      vipDetail({
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        vipMobile: this.vipMobile,
        tabIndex: this.memberIndex,
        search: this.searchInput,
      })
        .then((res) => {
          // console.log(res.data.vipData);
          if (res.data.vipData == null || res.data.vipData == [] || res.data.tabList == [] || res.data.tabList == null) {
            this.$toast(res.msg);
          } else {
            this.vipData = res.data.vipData[0];
            this.vipNum = this.vipData.customerCode;
            this.tabList = this.memberIndex === 1 ? res.data.tabList[0] : res.data.tabList;
            if (this.show && this.memberIndex === 1) {
              this.$toast({
                message: `${res.msg}`,
                duration: 800,
              });
            }
            if (this.memberIndex === 1) {
              window.localStorage.setItem('sex', this.tabList.sex || '男');
              return;
            }
            if (this.memberIndex === 4) {
              this.getvipLabel();
              if (this.tabList.length === 0) return this.age = 18;
              this.age = this.tabList[0].age;
            }
          }
        })
        .catch(() => {
          this.vipData = '';
          this.vipNum = '';
          this.tabList = [];
        });
    },
    onLoad() {
      if (this.tabList.length < this.pageSize) {
        this.loading = false;
        this.finished = true;
      } else {
        const { tabList } = this;
        setTimeout(() => {
          this.pageNumber += 1;
          vipDetail({
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            vipMobile: this.vipMobile,
            tabIndex: this.memberIndex,
            search: this.searchInput,
          })
            .then((res) => {
              this.loading = false;
              this.total = res.data.totalCount;
              this.tabList = tabList.concat(res.data.tabList);
              if (this.tabList.length >= res.data.totalCount) {
                this.finished = true;
              }
            });
        }, 500);
      }
    },
    toConsumeDetail(number, storeId, storeName) {
      this.$router.push({
        name: 'consumeDetail',
        query: {
          number,
          storeId,
          storeName,
        },
      });
    },
    search() {
      this.vipData = '';
      this.vipMobile = this.vipMobile.trim();
      if (this.vipMobile == '') {
        this.$toast({
          message: '请输入手机号码!',
          duration: 1000,
        });
        return;
      }
      if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.vipMobile))) {
        this.$toast({
          message: '请输入正确的手机号码!',
          duration: 1000,
        });
        return;
      }
      this.getVipDetail();
    },
    editTag() {
      this.showTags = true;
      this.getFixedLabel();
    },
    // 获取固定标签
    getFixedLabel() {
      fixedVipLabel({})
        .then(({ data }) => {
          this.tagsList = data;
        })
        .catch(() => {
          this.tagsList = [];
        });
    },
    // 选择标签
    checkTags(name, id) {
      const check = {};
      check.fixedTagId = id;
      check.fixedTagName = name;
      check.vipNum = this.vipNum;
      check.empId = this.empId;
      if (this.checkbox.length === 0) {
        this.checkbox.push(check);
      } else {
        const res = this.contains(this.checkbox, check.fixedTagId, 'fixedTagId');
        if (!res) {
          this.checkbox.push(check);
        } else {
          const idx = this.getIndex(this.checkbox, check);
          this.checkbox.splice(idx, 1);
        }
      }
    },
    tagsClose() {
      if (!this.flag) {
        this.vipFixedTagList = [];
      }
    },
    // 检查数组中是否包含特定的对象
    contains(a, id, type) {
      for (let i = 0; i < a.length; i++) {
        if (a[i][type] === id) {
          return true;
        }
      }
      return false;
    },
    getIndex(arr, obj) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].fixedTagId == obj.fixedTagId) {
          return i;
        }
      }
    },
    submitTags() {
      // if (this.checkbox.length === 0 && this.definedLabel.length === 0) {
      //   this.$toast({
      //     message: '请选择标签',
      //     duration: 800,
      //   });
      //   return;
      // }
      Promise.all([
        // 编辑
        updFixedVipLabel({
          vipNum: this.vipNum,
          vipFixedTagList: this.checkbox,
        }),
        // 自定义标签
        updDefinedVipLabel({
          vipNum: this.vipNum,
          VipDefinedList: this.definedLabel,
        }),
      ])
        .then((res) => {
          this.$toast({
            type: 'success',
            message: `${res[0].msg}`,
            duration: 800,
          });
          this.showTags = false;
          this.checkbox = [];
          this.vipFixedTagList = [];
          this.LabelList = [];
          this.vipDefinedList = [];
          this.tags = [];
          this.flag = true;// 判断是否点击了保存
          this.getvipLabel();
        });
    },
    sureDefined() {
      this.input = this.input.trim();
      if (this.input === '') return;
      const label = {};
      label.tag = this.input;
      label.vipNum = this.vipNum;
      label.empId = this.empId;
      this.input = '';
      const res = this.contains(this.definedLabel, label.tag, 'tag');
      if (res) {
        this.$toast({
          message: '勿添加相同的标签哦',
          duration: 1000,
        });
      } else {
        this.definedLabel.push(label);
      }
    },
    closeTags(index) {
      this.definedLabel.splice(index, 1);
    },
    // 标签列表
    tagList() {
      this.showList = true;
    },
    closePopup1() {
      this.showTags = false;
    },
    closePopup2() {
      this.showList = false;
    },
    /**
       * Created by zyj on 2019-10-22
       * 发券
       */
    faquan() {
      // console.log(this.vipData);
      if (this.vipData.vipMobile == undefined) {
        this.$toast({
          message: '请查询会员',
          duration: 800,
        });
        return;
      }
      this.$router.push({
        name: 'couponList',
        query: {
          vipMobile: this.vipData.vipMobile,
          vipCode: this.vipData.customerCode,
        },
      });
    },
    // 查询
    chaxun() {
      this.searchInput = '';
      this.showSearch = true;
    },
    beforeClose(action, done) {
      if (action === 'confirm') {
        setTimeout(done, 500);
      } else {
        done();
      }
    },
    confirm() {
      this.showSearch = false;
      // if (this.searchInput === '') return;
      this.getVipDetail();
    },
    cancel() {
      this.showSearch = false;
      this.searchInput = '';
    },
    toDetail(list) {
      this.$router.push({
        name: 'codeDetail',
        query: {
          couponCode: list.coupon_code,
          vipMobile: this.vipData.vipMobile,
        },
      });
    },
    couponDetail(couponCode) {
      this.$router.push({
        name: 'consumeDetail',
        query: { couponCode },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "@/assets/style/work-public.scss";
  @import "@/assets/style/member-public.scss";

  .member_button {
    background-color: #fff;
  }

  /*会员信息*/
  .member_info {
    font-size: vw(14);
    height: vw(100);
    background: #fff;
    margin-top: vw(8);
    margin-bottom: vw(8);
    padding: 0 vw(10);
    position: relative;
    display: flex;

    div {
      margin: auto;
      flex-grow: 1;

      p {
        height: vw(30);
        line-height: vw(30);
      }
    }

    .img {
      width: vw(90);
    }

  }
.nameLine{
  height: vw(30);
  line-height: vw(30);
  display: flex;
  align-items: center;
  .name{
    width: vw(100);
  }
}
  /*表格样式*/
  /*表头  不滚动*/
  .tableHead {
    font-size: vw(14);
    background: #fff;
    /*margin-top: vw(8);*/
    height: vw(30);
    line-height: vw(30);
    color: $gray_color;
    border-bottom: 1px solid $tableBorder;
  }

  .table {
    padding: 0 vw(8);
    font-size: vw(14);
    height: auto;
    background: #fff;

    table {
      width: 100%;

      td {
        border-bottom: 1px solid $tableBorder;
        text-align: center;
        height: vw(34);
        line-height: vw(34);
        text-overflow: ellipsis;
        vertical-align: middle;
      }
    }
  }

  /*内容滚动区域*/
  .mm-content {
    /*height: 100%;*/
    /*padding: 0 vw(8);*/
    /*background: #fff;*/

    /*详细资料*/
    .detail {
      background: #fff;
      padding-left: vw(40);
      /*margin-top: vw(8);*/

      .detail_item {
        display: flex;
        align-items: center;
        padding: vw(8) vw(10);
        border-bottom: 1px solid $border_color;
        position: relative;

        .icon {
          font-size: vw(20);
          position: absolute;
          left: vw(-30);
          top: 50%;
          transform: translateY(-50%);
        }

        .gray {
          color: $gray_color;
        }

      }

      .detail_item:last-child {
        border-bottom: none;
      }
    }

    .cost_detail {
      .cost_item {
        text-align: center;
        height: vw(30);
        line-height: vw(30);
        display: flex;
        border-bottom: 1px solid $border_color;

        span {
          width: vw(80);
          flex-grow: 1;
        }
      }

      .cost_item:last-child {
        border-bottom: none;
      }

      .table_noData {
        height: vw(30);
        line-height: vw(30);
        text-align: center;
        background: #fff;
        color: $gray_color;
      }
    }

    /*标签信息*/
    .tagInfo {
      background: #fff;
      height: vw(320);
      position: relative;
      padding: vw(4);

      .outCircle {
        height: vw(80);
        width: vw(80);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        .img {
          text-align: center;

          img {
            width: 100%;
            height: 100%;
          }

          .age {
            padding: vw(2) vw(4);
            border-radius: 10px;
            display: inline-block;
            color: #fff;
            font-size: 12px;
            background-color: $theme-color;
          }
        }
      }

      .wrap {
        position: absolute;
        z-index: 2;
        /*padding: vw(10);*/

        svg {
          margin-left: -5px;
          margin-top: -24px;

          a {
            display: inline-block;
            border: 1px solid #ddd;
            background-color: red;
          }
        }
      }

      .dynamic, .fixed, .custom {
        width: 40%;
        border: 1px dashed #ccc;
        padding: vw(4) vw(10);
        position: absolute;
        border-radius: 30px;
        overflow: hidden;

        ul {
          li {
            display: inline-block;
            padding: vw(2);
            font-size: vw(12);
            border-radius: 6px;
            margin: vw(2);
          }
        }
      }

      .dynamic {
        bottom: vw(6);
        left: vw(6);
        height: vw(150);

        ul {
          li {
            border: 1px dashed #ffa71e;
            color: #ffa71e;
          }
        }
      }

      .fixed {
        width: 90%;
        height: vw(86);
        top: vw(36);
        right: 50%;
        transform: translateX(50%);

        ul {
          li {
            border: 1px dashed #276fcc;
            color: #276fcc;
          }
        }
      }

      .custom {
        bottom: vw(6);
        right: vw(6);
        height: vw(150);

        ul {
          li {
            border: 1px dashed #28ccb4;
            color: #28ccb4;
          }
        }
      }
    }

    .tag {
      display: flex;
      position: relative;
      z-index: 999;
      width: 100%;

      .editTag, .tagList {
        position: absolute;
        top: 0;
        color: $theme-color;
        border: 1px solid $theme-color;
        padding: vw(4);
        border-radius: vw(6);

        i {
          font-size: vw(10);
        }

        span {
          font-size: vw(12);
        }
      }

      .editTag {
        right: vw(66);
      }

      .tagList {
        right: 0;
      }
    }

  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }

  .tagBox {
    font-size: vw(13);
    position: relative;

    .header {
      height: vw(72);

      .van-cell {
        height: vw(36);
        line-height: vw(36);
        padding: 0 vw(20);
      }
    }

    .tagItem {
      display: flex;
      align-items: center;
      //border-bottom: 1px solid $border_color;
      margin: vw(10) 0;
      height: auto;
      padding: vw(4) vw(10);

      .tagsLeft {
        width: 26%;
        color: $theme-color;
      }

      .tagsRight {
        width: 74%;

        li {
          display: inline-block;
          padding: vw(3) vw(8);
          border: 1px solid $tableBorder;
          margin: vw(2) vw(4);
          border-radius: 4px;
        }
      }
    }

    .tagsButton {
      background-color: $theme-color;
      color: #fff;
      letter-spacing: vw(6);
      border-radius: vw(6);
    }
  }

  .active {
    //background-color: $theme-color;
    color: $theme-color;
    border: 1px solid $theme-color !important;
  }


  .input {
    float: left;
    /*width: 75%;*/
    height: vw(40);
    padding: vw(9);
    border: none;
    background: #F7F8FA;
    box-sizing: border-box;
    /*margin: vw(10) 5% vw(10) 0;*/
  }

  .button {
    float: left;
    width: 20%;
    height: vw(40);
    line-height: vw(40);
    margin-top: vw(8);
    margin-bottom: vw(10);
  }

  .definedList {
    span {
      display: inline-block;
      padding: 0 vw(5);
      border: 1px dashed $theme-color;
      color: $theme-color;
      border-radius: 6px;
      margin-right: vw(10);
      margin-bottom: vw(10);

      i {
        padding: vw(5) 0 vw(5) vw(15);
      }
    }
  }

  .scroll {
    padding: 0 vw(10);
  }

  .listHeader {
    height: vw(36);

    .van-cell {
      height: vw(36);
      line-height: vw(36);
      padding: 0 vw(20);
    }
  }

  .closeIcon {
    position: absolute;
    top: vw(7);
    right: vw(15);
    font-size: vw(24);
    color: #ccc;
  }

  .closeIcon:active {
    color: #10AEFF;
  }

  .color {
    span {
      font-size: vw(10);
      margin: 0 vw(5);

      i {
        display: inline-block;
        width: vw(8);
        height: vw(8);
        border-radius: 50%;
        margin: 0 vw(4);
      }
    }
  }

  .callTel {
    width: 80%;

    a {
      font-size: vw(18);
      height: vw(60);
      line-height: vw(60);
      padding: 0 vw(30);
      border-bottom: 1px solid $border_color;
      display: flex;
      justify-content: start;
      align-items: center;

      i {
        font-size: vw(18);
        margin-right: vw(10);
      }
    }
  }

</style>
