<template>
  <body>
  <MenuButton :typeList="typeList" @changeType="changeType"
              :typeIndex="typeIndex">
  </MenuButton>
  <div class="table tableHead">
    <table border="0" cellspacing="0" cellpadding="0" rules="groups">
      <tbody>
      <tr>
        <td width="20%" style="height: 30px;">任务名称</td>
        <td width="20%" style="height: 30px;">任务年月</td>
        <td width="20%" style="height: 30px;">目标张数</td>
        <td width="20%" style="height: 30px;">实际张数</td>
        <td width="20%" style="height: 30px;">任务状态</td>
      </tr>
      </tbody>
    </table>
  </div>
  <main>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" :success-duration=500>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text=""
        :immediate-check="false"
        @load="onLoad"
        :offset="10">
        <div class="mm-content">
          <div class="table">
            <table border="0" cellspacing="0" cellpadding="0" rules="groups">
              <tbody>
              <tr v-for="(item,index) in list" :key="index"
                  @click="toDetail(item.itemId,item.taskId,item.taskName,item.yearMonth,item.summaryAmount,item.status)">
                <van-cell class="vanCell">
                  <span class="line1">{{item.taskName}}</span>
                  <span class="time">{{item.yearMonth}}</span>
                  <span class="zMoney">{{item.summaryAmount}}</span>
                  <span class="zMoney">{{item.actualTarget}}</span>
                  <span v-show="item.status===1" class="status" style="color: #4f77aa;">进行中</span>
                  <span v-show="item.status===2" class="status" style="color:#d9d9d9;">未开始</span>
                  <span v-show="item.status===3" class="status" style="color: #04be02;">已达成</span>
                  <span v-show="item.status===4" class="status" style="color: #f00;">已结束</span>
                </van-cell>
              </tr>
              </tbody>
            </table>
            <div class="noData" v-show="list.length==0">
              暂无数据
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <yd-backtop right="8%" bottom="20%"></yd-backtop>
  </main>
  </body>
</template>
<script>
  import MenuButton from '@/components/menu-button.vue';
  import { myTaskValueCard } from '@/api/work';

  export default {
    name: 'myValueCardIndicator',
    components: {
      MenuButton,
    },
    data() {
      return {
        typeList: [
          {
            value: 1,
            name: '业绩指标',
          },
          {
            value: 2,
            name: '会员招募指标',
          },
          {
            value: 3,
            name: '储值卡指标',
          },
        ],
        typeIndex: 3,
        pageSize: 20,
        pageNumber: 1,
        list: [],
        isLoading: false,

        finished: false,
        loading: false,
        total: 0,
        empId: window.localStorage.getItem('iposUserid')
      };
    },
    created() {
      this.getPerList();
    },
    activated() {
      this.pageNumber = 1;
      this.getPerList();
    },
    methods: {
      changeType(id) {
        if (id == 1) {
          this.$router.push({ name: 'myPerformanceIndicator' });
        } else if (id == 2) {
          this.$router.push({ name: 'myRecruitIndicator' });
        } else if (id == 3) {
          this.$router.push({ name: 'myValueCardIndicator' });
        }
      },
      getPerList() {
        myTaskValueCard({
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
          empId: this.empId
        })
          .then(({ data }) => {
            this.list = data.taskList;
            this.isLoading = false;
          })
          .catch(() => {
            this.list = [];
            this.isLoading = false;
          });
      },
      toDetail(itemId, taskId, taskName, yearMonth, summaryAmount, status) {
        this.$router.push({
          name: 'myValueCardDetail',
          query: {
            itemId,
            taskId,
            taskName,
            yearMonth,
            summaryAmount,
            status
          }
        });
      },
      onRefresh() {
        setTimeout(() => {
          this.pageNumber = 1;
          this.getPerList();
        }, 500);
      },
      onLoad() {
        if (this.list.length < this.pageSize) {
          this.loading = false;
          this.finished = true;
        } else {
          const { list } = this;
          setTimeout(() => {
            this.pageNumber += 1;
            myTaskValueCard({
              pageSize: this.pageSize,
              pageNumber: this.pageNumber,
              empId: this.empId
            })
              .then(({ data }) => {
                this.total = data.totalCount;
                this.list = list.concat(data.list);
                this.loading = false;
                if (this.list.length >= data.totalCount) {
                  this.finished = true;
                }
              });
          }, 500);
        }
      },
    }
  };
</script>

<style lang="scss" scoped>
  @import "@/assets/style/work-public.scss";

  .van-cell__value--alone {
    width: 100%;
    text-align: center;
    display: flex;
    padding: 0 vw(4);

    span {
      display: inline-block;
      border-bottom: 1px solid #E5E5E5;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .time {
      width: 25%;
    }

    .zMoney {
      width: 25%;
    }

    .line1 {
      width: 25%;
      color: #0F90D2;
    }

    .status {
      width: 25%;
    }
  }
</style>
