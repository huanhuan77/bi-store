<template>
  <body>
  <!--<main>-->
  <!--<van-pull-refresh v-model="isLoading" @refresh="onRefresh">-->
  <MenuButton :typeIndex="typeIndex" :typeList="typeList" @changeType="changeType"></MenuButton>
  <div class="timeBox">
    <div class="time">
      <span @click="showPopup" class="time-select">{{nowDate}}</span>
      <van-icon name="arrow-down" v-show="!show"></van-icon>
      <van-icon name="arrow-up" v-show="show"></van-icon>

      <van-popup
        v-model="show"
        position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          :formatter="formatter"
          type="date"
          @cancel="cancel"
          @confirm="confirm"></van-datetime-picker>
      </van-popup>
    </div>
    <TimeButton :timeIndex="timeIndex" :timeList="timeList" @changeTime="changeTime"></TimeButton>
  </div>
  <div class="table tableHead">
    <table border="0" cellspacing="0" cellpadding="0" rules="groups">
      <tbody>
      <tr>
        <td width="50%">时间</td>
        <!--<td width="25%">金额</td>-->
        <td width="50%">数量</td>
        <!--<td width="15%">导购</td>-->
      </tr>
      </tbody>
    </table>
  </div>
  <main>
    <div class="mm-content">
      <template v-if="list.length!=0">
        <div class="table">
          <table border="0" cellspacing="0" cellpadding="0" rules="groups">
            <tbody>
            <tr v-for="(item,index) in list" :key="index">
              <td width="50%">{{item.dateKey | replaceDate}}</td>
              <!--<td width="25%">{{item.sXfje}}</td>-->
              <td width="50%">{{item.cardNum}}</td>
              <!--<td width="15%"></td>-->
            </tr>
            </tbody>
          </table>
          <!--<div class="noData">没有更多了~</div>-->
        </div>
      </template>
      <template v-else>
        <div class="noData">
          暂无数据
        </div>
      </template>
    </div>
  </main>
  <!--</van-pull-refresh>-->
  <!--</main>-->
  </body>
</template>

<script>
  import MenuButton from '@/components/menu-button.vue';
  import TimeButton from '@/components/time-button.vue';
  import { ValueCard } from '@/api/sales';

  export default {
    name: 'valueCard',
    components: {
      TimeButton,
      MenuButton,
    },
    data() {
      return {
        typeIndex: 3,
        typeList: [
          {
            value: 1,
            name: '店铺业绩',
          },
          {
            value: 2,
            name: '店铺会员招募',
          },
          {
            value: 3,
            name: '店铺储值卡',
          }],
        tabindex: 1,
        timeList: [
          {
            value: 1,
            name: '日',
          },
          {
            value: 2,
            name: '周',
          },
          {
            value: 3,
            name: '月',
          }],
        timeIndex: 1,
        list: [],
        status: 0,
        isLoading: false,

        show: false,
        currentDate: new Date(),
        nowDate: new Date().format('yyyy-MM-dd'), // 用来展示当前年月
      };
    },
    created() {
      this.nowDate = this.yesterday();
      this.getValueCard();
    },
    methods: {
      yesterday() {
        const timenow = new Date();
        timenow.setDate(timenow.getDate() - 1); // 设置天数 -1 天，昨天的日期
        const y = timenow.getFullYear();// 年
        let m = timenow.getMonth() + 1;// 月
        m = m < 10 ? `0${m}` : m;
        let d = timenow.getDate();// 日
        d = d < 10 ? (`0${d}`) : d;
        const yesterdayTime = `${y}-${m}-${d}`;// 字符串拼接成自己想要的时间格式，现在是yyyy/mm/dd格式
        return yesterdayTime;
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
      changeType(id) {
        if (id == 1) {
          this.$router.push({ name: 'storePerformance' });
        } else if (id == 2) {
          this.$router.push({ name: 'memberRecruit' });
        } else if (id == 3) {
          this.$router.push(({ name: 'valueCard' }));
        }
      },
      changeTime(id) {
        if (this.timeIndex == id) return;
        this.timeIndex = id;
        this.status = this.timeIndex - 1;
        this.list = [];
        if (id == 1) {
          this.nowDate = this.yesterday();
        } else {
          this.nowDate = new Date().format('yyyy-MM-dd');
        }
        this.getValueCard();
      },
      getValueCard() {
        ValueCard({
          status: this.status,
          pointTime: this.nowDate,
        })
          .then((res) => {
            this.list = res.data;
            this.isLoading = false;
          })
          .catch(() => {
            this.list = [];
            this.isLoading = false;
          });
      },
      // 下拉刷新
      onRefresh() {
        setTimeout(() => {
          this.getValueCard();
        }, 500);
      },
      showPopup() {
        this.show = true;
      },
      confirm(value) {
        this.show = false;
        this.nowDate = value.format('yyyy-MM-dd');
        this.getValueCard();
      },
      cancel() {
        this.show = false;
      },
    },
  };
</script>

<style scoped lang="scss">
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

  /*类别按钮*/
  .timeBox {
    padding: vw(8);
    margin-top: vw(8);
    background: #fff;
    position: relative;

    .time {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 0 vw(10) 0;
      font-size: vw(14);

      .time-select {
        display: block;
      }
    }
  }

  /*滚动区域*/
  .mm-content {
    background-color: #fff;

    .table {
      padding: 0 vw(10);
    }
  }

  .table {
    font-size: vw(14);
    height: auto;
    background: #fff;

    table {
      width: 100%;

      td {
        border-bottom: 1px solid $tableBorder;
        text-align: center;
        height: vw(30);
        line-height: vw(30);
        text-overflow: ellipsis;
        vertical-align: middle;
      }
    }
  }

</style>
