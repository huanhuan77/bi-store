<template>
  <body>
  <!--<HeaderBar> </HeaderBar>-->
  <!--  <MenuButton :typeIndex="typeIndex" :typeList="typeList" @changeType="changeType"></MenuButton>-->
  <!--<div class="buttomItem">-->
    <!--<div @click="$router.push({name:'shouye'})" v-if="type !=4">店铺</div>-->
    <!--<div class="active_button"  v-if="type !=2">个人</div>-->
  <!--</div>-->
  <storePerson :name="name" :names="names" :noStore="noStore" @changeTab="changeTab"></storePerson>
  <!-- 可以滚动内容区域 -->
  <main>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="mm-content">
        <!-- 内容区域 -->
        <!--业绩-->
        <div class="itembox" @click="clickStorePerformance">
          <div class="contentBox">
            <div class="content_h">
              业绩
            </div>
            <div class="content_main">
              <div class="content_left hong">
                <div>当天: <span>{{performanceHome.dayPerformance | NumFormat}}</span> 元</div>
                <div>本周: <span>{{performanceHome.weekPerformance | NumFormat}}</span> 元</div>
                <div>本月: <span>{{performanceHome.monthPerformance | NumFormat}}</span> 元</div>
              </div>
              <div class="content_right">
                <div>指标完成率: <span>{{performanceHome.dayPerformanceRate | numFilter}}</span> %</div>
                <div>指标完成率: <span>{{performanceHome.weekPerformanceRate | numFilter}}</span> %</div>
                <div>指标完成率: <span>{{performanceHome.monthPerformanceRate | numFilter}}</span> %</div>
              </div>
            </div>
          </div>
        </div>

        <!--会员招募-->
        <div class="itembox" @click="clickMember">
          <div class="contentBox">
            <div class="content_h">
              会员招募
            </div>
            <div class="content_main">
              <div class="content_left hong">
                <div>当天: <span>{{isNull(vipRecruitHome.dayVipRecruit)}}</span> 人</div>
                <div>本周: <span>{{isNull(vipRecruitHome.weekVipRecruit)}}</span> 人</div>
                <div>本月: <span>{{isNull(vipRecruitHome.monthVipRecruit)}}</span> 人</div>
              </div>
              <div class="content_right">
                <div>指标完成率: <span>{{vipRecruitHome.dayVipRecruitRate | numFilter}}</span> %</div>
                <div>指标完成率: <span>{{vipRecruitHome.weekVipRecruitRate | numFilter}}</span> %</div>
                <div>指标完成率: <span>{{vipRecruitHome.monthVipRecruitRate | numFilter}}</span> %</div>
              </div>
            </div>
          </div>
        </div>

        <!--储值卡-->
        <!--<div class="itembox" @click="clickValueCard">-->
        <!--<div class="contentBox">-->
        <!--<div class="content_h">-->
        <!--储值卡-->
        <!--</div>-->
        <!--<div class="content_main">-->
        <!--<div class="content_left">-->
        <!--<div>当天: <span>{{isNull(valueCardHome.dayValueCard)}}</span> 张</div>-->
        <!--<div>本周: <span>{{isNull(valueCardHome.weekValueCard)}}</span> 张</div>-->
        <!--<div>本月: <span>{{isNull(valueCardHome.monthValueCard)}}</span> 张</div>-->
        <!--</div>-->
        <!--<div class="content_right">-->
        <!--<div>指标完成率: <span>{{valueCardHome.dayValueCardRate | numFilter}}</span> %</div>-->
        <!--<div>指标完成率: <span>{{valueCardHome.weekValueCardRate | numFilter}}</span> %</div>-->
        <!--<div>指标完成率: <span>{{valueCardHome.monthValueCardRate | numFilter}}</span> %</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->

        <!--会员升降级-->
        <div class="itembox" @click="clickMemberGoOrDown">
          <div class="contentBox">
            <div class="content_h">
              会员升级
            </div>
            <div class="content_main">
              <div class="content_left">
                <div>本月预升级: <span>{{isNull(vipUpgradeHome.vipAsc)}}</span> 人</div>
              </div>
              <div class="content_right">
                <div>本月预降级: <span>{{isNull(vipUpgradeHome.vipDesc)}}</span> 人</div>
              </div>
            </div>
          </div>
        </div>

        <!--1730提醒-->
        <div class="itembox" @click="clickRemind">
          <div class="contentBox">
            <div class="content_h">
              1730提醒
            </div>
            <div class="content_main">
              <div class="content_left">
                <div>次日感谢: <span>{{isNull(RemindHome.Thanks)}}</span> 人</div>
                <div>30天保养通知: <span>{{isNull(RemindHome.Upkeep)}}</span> 人</div>
              </div>
              <div class="content_right">
                <div>7天使用情况: <span>{{isNull(RemindHome.Use)}}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!--生日提醒-->
        <div class="itembox" @click="clickBirthday">
          <div class="contentBox">
            <div class="content_h">
              生日提醒
            </div>
            <div class="content_main">
              <div class="content_left birthday">
                <div>当日生日: <span>{{isNull(birthdayRemindHome.dayBirthdaysCount)}}</span> 人</div>
                <div>当周生日: <span>{{isNull(birthdayRemindHome.weekBirthdaysCount)}}</span> 人</div>
                <div>当月生日: <span>{{isNull(birthdayRemindHome.monthBirthdaysCount)}}</span> 人</div>
              </div>
            </div>
          </div>
        </div>

        <!--即将流失会员-->
        <div class="itembox">
          <div class="contentBox">
            <div class="content_h">
              即将流失会员
            </div>
            <div class="content_main">
              <div class="content_left">
                <div><span>{{isNull(losingMembersHome)}}</span> 人</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </main>
  </body>
</template>

<script>
import { home } from '@/api/sales';
import storePerson from '@/components/store-person.vue';

export default {
  name: 'personal',
  components: {
    storePerson,
  },
  data() {
    return {
      names:{
        storeName:"店铺",
        personName:"个人"
      },
      name:'person',
      isLoading: false,
      performanceHome: {}, // 业绩
      vipRecruitHome: {}, // 会员招募
      valueCardHome: {}, // 储值卡
      vipUpgradeHome: {}, // 会员升级
      RemindHome: {}, // 1730提醒
      birthdayRemindHome: '', // 生日提醒
      losingMembersHome: '', // 流失会员
      type: '', // 类型
    };
  },
  created() {
    this.type = window.localStorage.getItem('type');
    //this.getIndex();
  },
  methods: {
    changeTab(name) {
      if (name = 'store') {
        this.$router.push({ name: 'shouye' });
      } else {
        this.$router.push({ name: 'personal' });
      }
    },
    // 首页数据
    getIndex() {
      const empId = window.localStorage.getItem('iposUserid');
      home({
        empId,
      })
        .then((res) => {
          this.performanceHome = this.isNull(res.data.performanceHome);
          this.vipRecruitHome = this.isNull(res.data.vipRecruitHome);
          this.valueCardHome = this.isNull(res.data.valueCardHome);
          this.vipUpgradeHome = this.isNull(res.data.vipUpgradeHome);
          this.RemindHome = this.isNull(res.data.RemindHome);
          this.birthdayRemindHome = this.isNull(res.data.birthdayRemindHome);
          this.losingMembersHome = this.isNull(res.data.losingMembersHome);
          this.isLoading = false;
          // console.log(res.data);
        });
    },
    isNull(value) {
      if (value == null || value == 0 || value == '') return '0';
      return value;
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.getIndex();
      }, 500);
    },
    // 业绩
    clickStorePerformance() {
      this.$router.push({ name: 'personalPerformance' });
    },
    // 会员招募
    clickMember() {
      this.$router.push({ name: 'personalMemberRecruit' });
    },
    // 会员升降级
    clickMemberGoOrDown() {
      this.$router.push({
        name: 'memberUp_myMember',
        query: { noStore: true },
      });
    },
    // 会员1730提醒
    clickRemind() {
      this.$router.push({
        name: 'member_1730_myRemind',
        query: { noStore: true },
      });
    },
    // 会员生日提醒
    clickBirthday() {
      this.$router.push({
        name: 'memberBirthday_myMember',
        query: {
          noStore: true,
        },
      });
    },
    // 储值卡
    clickValueCard() {
      // this.$router.push({ name: 'valueCard' });
    },
  },

};
</script>

<style lang="scss" scoped>
  .mm-content {
    //首页项目的样式
    .itembox {
      background: #fff;
      margin-top: vw(8);
      padding: vw(10);

      .contentBox {
        width: 100%;
        border: 1px solid #c3d3e8;
        margin: 0 auto;
        border-radius: vw(4);
        overflow: hidden;

        .content_h {
          padding: 0 vw(15);
          font-weight: 600;
          height: vw(30);
          line-height: vw(30);
          border-bottom: 1px solid #e9e6e6;
        }

        .content_main {
          display: flex;

          div {
            flex-grow: 1;
          }

          .content_left {
            width: 50%;
            padding: vw(5) vw(15);
            border-right: 1px solid #e9e6e6;

            div {
              height: vw(20);
              line-height: vw(20);
            }
          }

          .content_right {
            width: 50%;
            padding: vw(5) vw(15);

            div {
              height: vw(20);
              line-height: vw(20);
            }
          }

          span {
            font-size: vw(16);
            color: #000;
          }
        }

        .hong span {
          color: #e63f3f;
        }
      }
    }
  }

  .birthday {
    display: flex;
    flex-wrap: wrap;

    div {
      width: 50%;
    }
  }
</style>
