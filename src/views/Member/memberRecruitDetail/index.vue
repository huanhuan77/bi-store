<template>
  <body>
  <div class="timeBox">
    <div class="time">
      <span @click="showPopup" class="time-select">{{nowDate}}</span>
      <van-icon name="arrow-down" v-show="!show"/>
      <van-icon name="arrow-up" v-show="show"/>

      <van-popup
        v-model="show"
        position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          :formatter="formatter"
          type="date"
          @cancel="cancel"
          @confirm="confirm"/>
      </van-popup>
    </div>
    <TimeButton :timeIndex="timeIndex" :timeList="timeList" @changeTime="changeTime"></TimeButton>
  </div>
  <div class="table tableHead">
    <table border="0" cellspacing="0" cellpadding="0" rules="groups">
      <tbody>
      <tr>
        <td width="50%">时间</td>
        <td width="50%">招募人数</td>
        <!--        <td width="30%">招募人</td>-->
      </tr>
      </tbody>
    </table>
  </div>
  <main>
    <div class="mm-content">
      <template v-if="list.length !=0">
        <div class="table">
          <table border="0" cellspacing="0" cellpadding="0" rules="groups">
            <tbody>
            <tr v-for="(item,index) in list" :key="index">
              <td width="50%">{{item.timeSlot}}</td>
              <td width="50%">{{item.test}}</td>
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
  </body>
</template>

<script>
  import TimeButton from '@/components/time-button.vue';
  import { vipRecruitDetails } from '@/api/vip';

  export default {
    name: 'memberRecruitDetail',
    components: { TimeButton },
    data() {
      return {
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
        timeIndex: 0,
        list: [],
        pageSize: 30,
        pageNumber: 1,
        loading: false,
        finished: false,
        isLoading: false,

        show: false,
        currentDate: new Date(),
        nowDate: new Date().format('yyyy-MM-dd'), // 用来展示当前年月
      };
    },
    created() {
      this.timeIndex = this.$route.query.id - 1;

      if (this.timeIndex == 1) {
        this.nowDate = this.yesterday();
      } else {
        this.nowDate = new Date().format('yyyy-MM-dd');
      }
      this.getDetail();
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
      changeTime(id) {
        if (this.timeIndex == id) return;
        this.timeIndex = id;
        this.pageNumber = 1;
        if (this.timeIndex == 1) {
          this.nowDate = this.yesterday();
        } else {
          this.nowDate = new Date().format('yyyy-MM-dd');
        }
        this.getDetail();
      },
      onRefresh() {
        this.isLoading = true;
        this.pageNumber = 1;
        this.getDetail();
      },
      getDetail() {
        vipRecruitDetails({
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
          type: this.timeIndex,
          pointTime: this.nowDate,
          // date: this.nowDate,
        })
          .then((res) => {
            // this.isLoading = false;
            if (res.data.list.length != 0) {
              // this.finished = false;
              this.list = res.data.list;
            } else {
              this.$toast({
                message: '哦偶，没招募到会员',
                duration: 800,
              });
              this.list = [];
              // this.finished = true;
            }
          })
          .catch(() => {
            this.list = [];
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
            vipRecruitDetails({
              pageSize: this.pageSize,
              pageNumber: this.pageNumber,
              type: this.timeIndex,
              pointTime: this.nowDate,
            })
              .then((res) => {
                this.list = list.concat(res.data.list);
                this.loading = false;
                if (this.list.length >= res.data.totalCount) {
                  this.finished = true;
                }
              });
          }, 500);
        }
      },
      /**
       * @时间选择器
       * @Create By Huan 2019-7-12
       */
      showPopup() {
        this.show = true;
      },
      confirm(value) {
        this.show = false;
        this.nowDate = value.format('yyyy-MM-dd');
        this.pageNumber = 1;
        this.getDetail();
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
    /*height: vw(80);*/
    margin-top: vw(8);
    background: #fff;

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
