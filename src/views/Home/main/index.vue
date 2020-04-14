<template>
  <body>
  <storePerson :name="name" :names="names" @changeTab="changeTab"></storePerson>
  <main>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" :success-duration=500>
      <div class="mm-content">
        <!-- 内容区域 -->
        <!--业绩-->
        <div class="itembox" @click="clickStorePerformance">
          <div class="contentBox">
            <div class="content_h">
              业绩
            </div>
            <div class="content_main ">
              <div class="content_left hong">
                <div>当天: <span>{{performanceHome.dayPerformance | NumFormat}}</span> 元</div>
                <div>本周: <span>{{performanceHome.weekPerformance | NumFormat}}</span> 元</div>
                <div>本月: <span>{{performanceHome.monthPerformance | NumFormat}}</span> 元</div>
              </div>
              <div class="content_right">
                <div>指标完成率: <span>{{performanceHome.dayComplete ||0}}</span> %</div>
                <div>指标完成率: <span>{{performanceHome.weekComplete ||0}}</span> %</div>
                <div>指标完成率: <span>{{performanceHome.monthComplete ||0}}</span> %</div>
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
            <div class="content_main ">
              <div class="content_left hong">
                <div>当天: <span>{{isNull(vipRecruitHome.dayVipRecruit)}}</span> 人</div>
                <div>本周: <span>{{isNull(vipRecruitHome.weekVipRecruit)}}</span> 人</div>
                <div>本月: <span>{{isNull(vipRecruitHome.monthVipRecruit)}}</span> 人</div>
              </div>
              <div class="content_right">
                <div>指标完成率: <span>{{vipRecruitHome.dayRecruitComplete||0 }}</span> %</div>
                <div>指标完成率: <span>{{vipRecruitHome.weekRecruitComplete ||0}}</span> %</div>
                <div>指标完成率: <span>{{vipRecruitHome.monthRecruitComplete ||0}}</span> %</div>
              </div>
            </div>
          </div>
        </div>

        <!--储值卡-->
        <div class="itembox" @click="clickValueCard" v-show="!person">
          <div class="contentBox">
            <div class="content_h">
              储值卡
            </div>
            <div class="content_main">
              <div class="content_left">
                <div>当天: <span>{{isNull(valueCardHome.dayCardNum)}}</span> 张</div>
                <div>本周: <span>{{isNull(valueCardHome.weekCardNum)}}</span> 张</div>
                <div>本月: <span>{{isNull(valueCardHome.monthCardNum)}}</span> 张</div>
              </div>
              <div class="content_right">
                <div>指标完成率: <span>{{valueCardHome.dayCardComplete||0 }}</span> %</div>
                <div>指标完成率: <span>{{valueCardHome.weekCardComplete||0 }}</span> %</div>
                <div>指标完成率: <span>{{valueCardHome.monthCardComplete ||0}}</span> %</div>
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
                <div>次日感谢: <span>{{isNull(RemindHome.yeseterdayRemind)}}</span> 人</div>
                <div>30天保养通知: <span>{{isNull(RemindHome.thirtyDateRemind)}}</span> 人</div>
              </div>
              <div class="content_right">
                <div>7天使用反馈情况: <span>{{isNull(RemindHome.sevenDateRemind)}}</span>人</div>
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
              <div class="content_left ">
                <div>当日生日: <span>{{isNull(birthdayRemindHome.dayBirthdaysCount)}}</span> 人</div>
                <div>本月生日: <span>{{isNull(birthdayRemindHome.monthBirthdaysCount)}}</span> 人</div>
              </div>
              <div class="content_right">
                <div>本周生日: <span>{{isNull(birthdayRemindHome.weekBirthdaysCount)}}</span> 人</div>
              </div>
            </div>
          </div>
        </div>

        <!--会员升降级-->
        <div class="itembox" @click="clickMemberGoOrDown">
          <div class="contentBox ">
            <div class="content_h">
              会员预升/降级
            </div>
            <div class="content_main">
              <div class="content_left">
                <div>当天预降级: <span>{{isNull(vipDowngradeHome.dayVipDowngrade)}}</span> 人</div>
                <div>本周预降级: <span>{{isNull(vipDowngradeHome.weekVipDowngrade)}}</span> 人</div>
                <div>本月预降级: <span>{{isNull(vipDowngradeHome.monthVipDowngrade)}}</span> 人</div>
              </div>
              <div class="content_right">
                <div>本月预升级: <span>{{isNull(vipUpgradeHome.upgradeNum)}}</span> 人</div>
              </div>
            </div>
          </div>
        </div>

        <!--即将流失会员-->
        <div class="itembox" @click="clickLosing">
          <div class="contentBox huiBox">
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
  import { home, myHome } from '@/api/sales';
  import storePerson from '@/components/store-person.vue';

  export default {
    name: 'shouye',
    components: {
      storePerson,
    },
    data() {
      return {
        code: 0,
        isLoading: false,
        names: {
          storeName: '店铺',
          personName: '个人',
        },
        name: '',
        performanceHome: {}, // 业绩
        vipRecruitHome: {}, // 会员招募
        valueCardHome: {}, // 储值卡
        vipUpgradeHome: {}, // 会员升级
        vipDowngradeHome: {}, // 会员升级
        RemindHome: {}, // 1730提醒
        birthdayRemindHome: '', // 生日提醒
        losingMembersHome: '', // 流失会员
        type: '', // 类型
      };
    },
    created() {
      this.type = window.localStorage.getItem('type');
      if (this.type != 4) {
        this.name = 'store';
        this.person = false;
        this.getIndexStore();
      } else {
        this.name = 'person';
        this.person = true;
        this.getIndexPerson();
      }
    },
    // watch: {
    //   type(newValue) {
    //     // 如果是个人跳到个人页面
    //     newValue == 4 ? this.$router.push({ name: 'personal' }) : '';
    //   },
    // },

    methods: {
      changeTab(name) {
        if (this.name == name) return;
        if (name == 'store') {
          this.name = 'store';
          this.person = false;
          this.getIndexStore();
        } else if (name == 'person') {
          this.name = 'person';
          this.person = true;
          this.getIndexPerson();
        }
      },
      // 下拉刷新
      onRefresh() {
        if (this.name == 'store') {
          setTimeout(() => {
            this.getIndexStore();
          }, 500);
        } else {
          setTimeout(() => {
            this.getIndexPerson();
          }, 500);
        }
      },
      isNull(value) {
        if (value == null || value == 0 || value == '') return '0';
        return value;
      },
      // 首页数据
      getIndexStore() {
        this.performanceHome = 0;
        this.vipRecruitHome = 0;
        this.valueCardHome = 0;
        this.vipUpgradeHome = 0;
        this.RemindHome = 0;
        this.birthdayRemindHome = 0;
        this.losingMembersHome = 0;
        home()
          .then(({ data }) => {
            //console.log(res.data);
            this.performanceHome = this.isNull(data.performanceHome);
            this.vipRecruitHome = this.isNull(data.vipRecruitHome);
            this.valueCardHome = this.isNull(data.valueCardHome);
            this.vipUpgradeHome = this.isNull(data.vipUpgradeHome[0]);
            this.vipDowngradeHome = this.isNull(data.vipDowngradeHome);
            this.RemindHome = this.isNull(data.RemindHome);
            this.birthdayRemindHome = this.isNull(data.birthdayRemindHome);
            this.losingMembersHome = this.isNull(data.losingMembersHome);
            this.isLoading = false;
          })
          .catch(() => {
            this.performanceHome = 0;
            this.vipRecruitHome = 0;
            this.valueCardHome = 0;
            this.vipUpgradeHome = 0;
            this.RemindHome = 0;
            this.birthdayRemindHome = 0;
            this.losingMembersHome = 0;
          });
      },
      // 首页数据
      getIndexPerson() {
        this.performanceHome = 0;
        this.vipRecruitHome = 0;
        this.valueCardHome = 0;
        this.vipUpgradeHome = 0;
        this.RemindHome = 0;
        this.birthdayRemindHome = 0;
        this.losingMembersHome = 0;
        const empId = window.localStorage.getItem('iposUserid');
        myHome({
          empId,
        })
          .then(({ data }) => {
            // console.log(res.data);
            this.performanceHome = this.isNull(data.performanceHome);
            this.vipRecruitHome = this.isNull(data.vipRecruitHome[0]);
            this.valueCardHome = this.isNull(data.valueCardHome);
            this.vipUpgradeHome = this.isNull(data.vipUpgradeHome[0]);
            this.RemindHome = this.isNull(data.RemindHome);
            this.birthdayRemindHome = this.isNull(data.birthdayRemindHome);
            this.losingMembersHome = this.isNull(data.losingMembersHome);
            this.isLoading = false;
          })
          .catch(() => {
            this.performanceHome = 0;
            this.vipRecruitHome = 0;
            this.valueCardHome = 0;
            this.vipUpgradeHome = 0;
            this.RemindHome = 0;
            this.birthdayRemindHome = 0;
            this.losingMembersHome = 0;
          });
      },
      // 业绩
      clickStorePerformance() {
        if (this.name == 'store') {
          this.$router.push({ name: 'storePerformance' });
        } else {
          this.$router.push({ name: 'personalPerformance' });
        }
      },
      // 会员招募
      clickMember() {
        if (this.name == 'store') {
          this.$router.push({ name: 'memberRecruit' });
        } else {
          this.$router.push({ name: 'personalMemberRecruit' });
        }
      },
      // 会员降级
      // clickMemberDown() {
      //   if (this.name == 'store') {
      //     this.$router.push({
      //       name: 'memberUp_storeMember',
      //       query: { down: true }
      //     });
      //   } else {
      //     this.$router.push({
      //       name: 'memberUp_myMember',
      //       query: { noStore: true },
      //     });
      //   }
      // },
      //会员升降级
      clickMemberGoOrDown() {
        if (this.name == 'store') {
          this.$router.push({
            name: 'memberUp_storeMember',
          });
        } else {
          this.$router.push({
            name: 'memberUp_myMember',
            query: { noStore: true },
          });
        }
      },
      // 会员1730提醒
      clickRemind() {
        if (this.name == 'store') {
          this.$router.push({
            name: 'member_1730_storeRemind',
            query: { type: 0 }
          });
        } else {
          this.$router.push({
            name: 'member_1730_myRemind',
            query: { noStore: true },
          });
        }
      },
      // 会员生日提醒
      clickBirthday() {
        if (this.name == 'store') {
          this.$router.push({
            name: 'memberBirthday_storeMember',
            query: { timeIndex: 0 }
          });
        } else {
          this.$router.push({
            name: 'memberBirthday_myMember',
            query: {
              noStore: true,
            },
          });
        }
      },
      // 储值卡
      clickValueCard() {
        if (this.name == 'store') {
          this.$router.push({ name: 'valueCard' });
        }
      },
      clickLosing() {
        this.$toast({
          message: '该功能正在开发中,敬请期待!',
          duration: 800
        });
      }
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
          padding: 0 vw(10);
          font-weight: 600;
          height: vw(30);
          line-height: vw(30);
          border-bottom: 1px solid $tableBorder;
        }

        .content_main {
          display: flex;

          div {
            flex-grow: 1;
          }

          .content_left {
            width: 50%;
            padding: vw(5) vw(10);
            border-right: 1px solid $tableBorder;

            div {
              height: vw(20);
              line-height: vw(20);
            }
          }

          .birthday {
            display: flex;
            flex-wrap: wrap;

            div {
              width: 50%;
            }
          }

          .content_right {
            width: 50%;
            padding: vw(5) vw(10);

            div {
              height: vw(20);
              line-height: vw(20);
            }
          }

          span {
            font-size: vw(16);
            /*color: #000;*/
          }
        }

        .hong span {
          color: $hong_color;
        }
      }
    }
  }
</style>
