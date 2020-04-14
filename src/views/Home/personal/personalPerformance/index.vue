<template>
  <body>
  <!--<storePerson :names="names" :name="name" @changeTab="changeTab" ></storePerson>-->
  <MenuButton :typeIndex="typeIndex" :typeList="typeList" @changeType="changeType"></MenuButton>
  <main>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" ref="pull" :disabled="show?true:false">
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
            <p>本月销售业绩</p>
            <yd-countup :endnum="left" startnum="0" class="number" duration="1" separator=","></yd-countup>
            元
          </div>
          <div class="rangeBox">
            <div class="item">
              <p>本月销售数量</p>
              <yd-countup :endnum="middle" startnum="0" class="number" duration="1" separator=","></yd-countup>
            </div>
            <div class="item">
              <p>本月业绩排名</p>
              <yd-countup :endnum="right" startnum="0" class="number" duration="1" separator=","></yd-countup>
            </div>
          </div>
        </div>
        <div class="second-box">
          <div class="table tableHead">
            <table border="0" cellspacing="0" cellpadding="0" rules="groups">
              <tbody>
              <tr>
                <td width="33.33%">时间</td>
                <td width="33.33%">销售额</td>
                <td width="33.33%">数量</td>
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
                    <td width="33.33%">{{item.DateKey | replaceDate}}</td>
                    <td width="33.33%">{{item.sAmount | NumFormat}}</td>
                    <td width="33.33%">{{item.sOrderQty }}</td>
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
  import { PersonalPerformance } from '@/api/sales';

  export default {
    name: 'personalPerformance',
    data() {
      return {
        // names:{
        //   storeName:'个人业绩',
        //   personName:'个人会员招募'
        // },
        // name:'store',
        currentDate: new Date(),
        show: false,
        empId: '', // 个人id
        nowDate: new Date().format('yyyy-MM'), // 用来展示当前年月
        date: '', // 用来传参
        list: [],
        left: 0,
        right: 0,
        middle: 0,
        isLoading: false,
        typeIndex: 1,
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
      this.date = `${this.nowDate}-01`;
      this.getPersonalData();
    },
    methods: {
      changeType(id) {
        if (id == 1) {
          this.$router.push({ name: 'personalPerformance' });
        } else if (id == 2) {
          this.$router.push({ name: 'personalMemberRecruit' });
        }
      },
      // changeTab(name){
      //   if (name=='store') {
      //     // 业绩
      //     this.$router.push({ name: 'personalPerformance' });
      //   } else if(name=='person'){
      //     // 会员招募
      //     this.$router.push({ name: 'personalMemberRecruit' });
      //   }
      // },
      formatter(type, value) {
        if (type === 'year') {
          return `${value}年`;
        }
        if (type === 'month') {
          return `${value}月`;
        }
        return value;
      },
      showPopup() {
        this.show = true;
      },
      confirm(value) {
        this.show = false;
        this.nowDate = value.format('yyyy-MM');
        this.date = `${value.format('yyyy-MM')}-01`;
        this.left = 0;
        this.middle = 0;
        this.right = 0;
        this.list = [];
        this.getPersonalData();
      },
      cancel() {
        this.show = false;
      },
      getPersonalData() {
        const empId = window.localStorage.getItem('iposUserid');
        PersonalPerformance({
          empId,
          date: this.date,
        })
          .then((res) => {
            // console.log(res.data.myPerformanceCard);
            if (res.data.myPerformanceCard != null) {
              this.left = res.data.myPerformanceCard.sAmount;
              this.right = res.data.myPerformanceCard.rank;
              this.middle = res.data.myPerformanceCard.sOrderQty;
              this.list = res.data.myPerformanceRecord;
              this.isLoading = false;
            } else {
              this.$toast({
                message: '哦偶，本月你没卖出任何东西！',
                duration: 800
              });
              this.isLoading = false;
              // 恢复0数值
              this.list = [];
              this.left = 0;
              this.right = 0;
              this.middle = 0;
            }
          })
          .catch(() => {
            this.isLoading = false;
            // 恢复0数值
            this.list = [];
            this.left = 0;
            this.right = 0;
            this.middle = 0;
          });
      },
      // 下拉刷新
      onRefresh() {
        setTimeout(() => {
          this.getPersonalData();
        }, 500);
      },
    },
    components: {
      MenuButton,
    },
  };

</script>

<style lang="scss" scoped>
  @import '@/assets/style/personal.scss';

  .personal-box {
    display: block;
  }
</style>
