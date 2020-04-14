<template>
<body>
<main id="main">
  <div class="table" style="margin-top: 10px">
    <table border="0" cellspacing="0" cellpadding="0" rules="groups">
      <tbody>
      <tr class="tableHead">
        <td width="25%">会员级别</td>
        <td width="25%">应维护人数</td>
        <td width="25%">实际维护人数</td>
        <td width="25%">完成率</td>
      </tr>
      <template v-if="gradeList.length !==0">
        <tr v-for="(item,index) in gradeList" :key="index">
          <td width="25%" >
            <van-button
              size="mini"
              :icon="vipType.includes(item.VipGrade)?'success':''"
              :class="vipType.includes(item.VipGrade) ?'active button':'button'"
              @click="selectType(item.VipGrade)"
            >{{item.VipGrade}}</van-button>
          </td>
          <td width="25%">{{item.totalNum}}</td>
          <td width="25%">{{item.labelNum}}</td>
          <td width="25%">{{item.completRate|formatPercent}}%</td>
        </tr>
      </template>
      <tr v-else>
        <td colspan="4" class="noData">暂无数据</td>
      </tr>
      </tbody>
    </table>
  </div>
    <div class="current_emp">当前店员:{{empName}}</div>

  <div class="mm-content" style="padding: 0">
    <van-sticky :offset-top="offsetTop">
    <div class="list_header" style="margin-top: 0">
      <div class="list_box">
        <span class="list_name">会员列表 </span>
        <span  class="list_name">({{vipList.length}})人</span>

        <div class="paixu" @click="handlePaixu" style="right: 10px;">
          <span>排序</span>
          <div>
            <van-icon name="arrow-up" :class="sort?'paixuActive':''"></van-icon>
            <van-icon name="arrow-down" :class="!sort?'paixuActive':''"></van-icon>
          </div>
        </div>
      </div>
    </div>
    </van-sticky>
      <div class="go_or_down_list" style="margin-top: 1px">
        <template v-if="vipList.length !==0">
          <div class="list_main">
            <div class="list_item" v-for="(vip,index) in vipList" :key="index" @click="toDetail(vip.vipMobile,vip.sex)">
              <van-button plain color="#4F77AA" size="mini" class="listButton"
                         >{{vip.isTag}}
              </van-button>
              <div class="img">
                <img
                  v-if="vip.vipGrade==='积分卡'"
                  style="height: 100%;width: 100%"
                  src="@/assets/image/1-1.jpg"
                />
                <img
                  v-else-if="vip.vipGrade==='黄金卡'"
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
                  <span>{{vip.vipGrade}}</span>
                </p>
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
    <yd-backtop bottom="80px"></yd-backtop>
  </div>
</main>
</body>
</template>

<script>
import * as vipLabel from '@/api/vipAnalysis/index';

export default {
  name: 'vipLabelMaintainDetail',
  data() {
    return {
      empId: '',
      gradeList: [], // 会员级别列表
      vipList: [], // 会员列表
      empName: '',
      offsetTop: 0,
      sort: true, // 默认升序
      isFirstEnter: false, // 是否第一次进入，默认false
      scroll: '',
      vipType: ['积分卡', '黄金卡', '铂金卡'],
    };
  },
  created() {
    this.isFirstEnter = true;
    this.offsetTop = document.getElementsByClassName('headerBox')[0].offsetHeight;
    this.empId = this.$route.query.empId;
    this.empName = this.$route.query.empName;
    this.getList();
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == 'memberDetail') {
      to.meta.isBack = true;
    }
    next();
  },
  activated() {
    if (!this.$route.meta.isBack || this.isFirstEnter) {
      this.empId = this.$route.query.empId;
      this.empName = this.$route.query.empName;
      this.gradeList = []; // 会员级别列表
      this.vipList = []; // 会员列表
      this.sort = true;// 默认升序
      this.vipType = ['积分卡', '黄金卡', '铂金卡'];
      this.getList();
    }
    this.$route.meta.isBack = false;
    this.isFirstEnter = false;

    const main = document.getElementById('main');
    if (this.scroll > 0) {
      main.scrollTo(0, this.scroll);
      this.scroll = 0;
      main.addEventListener('scroll', this.handleScroll());
    }
  },
  mounted() {
    const main = document.getElementById('main');
    main.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const main = document.getElementById('main');
      this.scroll = main.scrollTop;
    },
    getList() {
      vipLabel.empVipLable({
        empId: this.empId,
        vipGrade: this.vipType,
        sort: this.sort ? 1 : 2,
      })
        .then(({ data }) => {
          this.gradeList = data.totalData;
          this.vipList = data.vips;
        });
    },
    toDetail(vipMobile, sex) {
      window.localStorage.setItem('sex', sex); // 缓存性别 否则跳到详情页获取不到性别
      this.$router.push({
        name: 'memberDetail',
        query: {
          vipMobile,
          show: false,
          memberIndex: 4, // 跳到会员详情直接显示标签信息
        },
      });
    },

    handlePaixu() {
      this.sort = !this.sort;
      this.getList();
    },

    // 选择会员级别
    selectType(vipGrape) {
      const idx = this.vipType.indexOf(vipGrape);
      if (idx > -1) {
          this.vipType.splice(idx, 1);
      } else {
        this.vipType.push(vipGrape);
      }
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
  @import "@/assets/style/goodsAnalyze.scss";
  @import "@/assets/style/member-public.scss";
  .current_emp{
    height: vw(40);
    line-height: vw(40);
    background: #fff;
     margin-top: vw(10);
    padding-left: vw(15);
  }
  .active {
    border: 1px solid $theme-color !important;
    background-color: #fff !important;
    color: $theme-color !important;
  }
  .button {
    background-color: #e9e6e6;
    border: 1px solid #F7F8FA;
    border-radius: vw(5);
    width: 80px;

  }
</style>
