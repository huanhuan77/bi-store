<template>
  <body>
  <MenuButton :typeIndex="typeIndex" :typeList="typeList" @changeType="changeType"></MenuButton>
  <!--<storePerson :names="names" :name="name" @changeTab="changeTab"></storePerson>-->
  <main>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :disabled="show?true:false">
      <div class="personal">
        <div class="first-box">
          <div class="time">
            <span @click="showPopup" class="time-select">{{nowDate}}</span>
            <van-icon name="arrow-down" v-show="!show"/>
            <van-icon name="arrow-up" v-show="show"/>

            <van-popup
              v-model="show"
              position="bottom">
              <van-datetime-picker
                v-model="currentDate"
                type="year-month"
                :formatter="formatter"
                @cancel="cancel"
                @confirm="confirm"/>
            </van-popup>
          </div>
          <div class="personal-box">
            <div class="personal-left">
              <p>本月招募会员</p>
              <yd-countup :endnum="sum" startnum="0" class="number" duration="1" separator=","></yd-countup>
              人
            </div>
            <div class="personal-right">
              <p>本月招募排名</p>
              <yd-countup :endnum="rank" startnum="0" class="number" duration="1" separator=","></yd-countup>
            </div>
            <!--<van-tag type="primary">实时数据</van-tag>-->
          </div>
        </div>

        <div class="second-box">
          <div class="table tableHead">
            <table border="0" cellspacing="0" cellpadding="0" rules="groups">
              <tbody>
              <tr>
                <td width="25%">卡号</td>
                <td width="25%">姓名</td>
                <td width="25%">手机</td>
                <td width="25%">入会时间</td>
              </tr>
              </tbody>
            </table>
          </div>
          <template v-if="list.length!=0">
            <div class="mm-content">
              <div class="table">
                <table border="0" cellspacing="0" cellpadding="0" rules="groups">
                  <tbody>
                  <tr v-for="item in list">
                    <td width="25%">{{item.vipNum }}</td>
                    <td width="25%">{{item.VipName }}</td>
                    <td width="25%">{{item.VipMobile}}</td>
                    <td width="25%">{{item.CreateDate}}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="noData">
              暂无数据
            </div>
          </template>
        </div>
      </div>
    </van-pull-refresh>
    <yd-backtop></yd-backtop>
  </main>
  </body>
</template>

<script>
  import MenuButton from '@/components/menu-button.vue';
  import { PersonalMember } from '@/api/sales';

  export default {
    name: 'personalMemberRecruit',
    data() {
      return {
        // names:{
        //   storeName:'个人业绩',
        //   personName:'个人会员招募'
        // },
        // name:'person',
        currentDate: new Date(),
        show: false,
        nowDate: new Date().format('yyyy-MM'),
        date: '',
        isLoading: false,
        sum: 0,
        rank: 0,
        list: [],
        typeIndex: 2,
        typeList: [
          {
            value: 1,
            name: '个人业绩',
          },
          {
            value: 2,
            name: '个人会员招募',
          }],
      };
    },
    created() {
      this.date = this.nowDate + '-01';
      this.getMemberRecruit();
    },
    methods: {
      formatter(type, value) {
        if (type === 'year') {
          return `${value}年`;
        }
        if (type === 'month') {
          return `${value}月`;
        }
        return value;
      },
      changeType(id) {
        if (id == 1) {
          this.$router.push({ name: 'personalPerformance' });
        } else if (id == 2) {
          this.$router.push({ name: 'personalMemberRecruit' });
        }
      },
      // changeTab(name) {
      //   if (name=='store') {
      //     //业绩
      //     this.$router.push({ name: 'personalPerformance' });
      //   } else if(name=='person'){
      //     //会员招募
      //     this.$router.push({ name: 'personalMemberRecruit' });
      //   }
      // },
      showPopup() {
        this.show = true;
      },
      confirm(value) {
        this.show = false;
        this.nowDate = value.format('yyyy-MM');
        this.date = value.format('yyyy-MM') + '-01';
        this.sum = 0;
        this.rank = 0;
        this.list = [];
        this.getMemberRecruit();
      },
      cancel() {
        this.show = false;
      },
      getMemberRecruit() {
        let empId = window.localStorage.getItem('iposUserid');
        PersonalMember({
          empId: empId,
          date: this.date
        })
          .then((res) => {
            //console.log(res.data);
            if (res.data != null || res.data !== []) {
              if (res.data.myVipRecruit !== 0) {
                this.sum = res.data.myVipRecruit;
                this.list = res.data.myVipRecruitRecord;
                this.rank = res.data.myVipRecruitRank.rankNum;
                this.isLoading = false;
              } else {
                this.$toast({
                  message: '哦偶，本月没有招募会员哦，继续加油！',
                  duration: 800
                });
                this.isLoading = false;
                //恢复0数值
                this.sum = 0;
                this.rank = 0;
                this.list = [];
              }
            }
          })
          .catch(() => {
            this.isLoading = false;
            //恢复0数值
            this.sum = 0;
            this.rank = 0;
            this.list = [];
          });
      },
      //下拉刷新
      onRefresh() {
        setTimeout(() => {
          this.getMemberRecruit();
        }, 500);
      },
    },
    components: {
      MenuButton,
    },
  };

</script>

<style lang="scss">
  @import '@/assets/style/personal.scss';

  .van-pull-refresh {
    /*height: 100%;*/
  }

  .personal-box {
    display: flex;

    .personal-left {
      width: 50%;
    }

    .personal-right {
      width: 50%;
    }
  }
</style>
