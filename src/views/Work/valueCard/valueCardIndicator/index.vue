<template>
  <body>
  <div class="createIcon">
    <span class="iconfont icon-xinzeng2" @click="create"></span>
  </div>
  <MenuButton :typeList="stateList" @changeType="changeState"
              :typeIndex="stateIndex" class="stateList">
  </MenuButton>
  <div class="table tableHead">
    <table border="0" cellspacing="0" cellpadding="0" rules="groups">
      <tbody>
      <tr>
        <td width="25%" style="height: 30px;">任务名称</td>
        <td width="25%" style="height: 30px;">任务年月</td>
        <td width="25%" style="height: 30px;">指标张数</td>
        <td width="25%" style="height: 30px;">是否完成</td>
      </tr>
      </tbody>
    </table>
  </div>
  <main>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" :success-duration=500>
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        finished-text=""
        @load="onLoad"
        :offset="10">
        <div class="mm-content">
          <div class="table">
            <table border="0" cellspacing="0" cellpadding="0" rules="groups">
              <tbody>
              <tr v-for="(item,index) in list" :key="index" @click="toDetail(item.taskId,item.status)">
                <van-swipe-cell :right-width="60" class="vanCell">
                  <van-cell>
                    <span class="line1">{{item.taskName}}</span>
                    <!--<span class="time">{{item.startTime}}</span>-->
                    <!--<span class="time">{{item.endTime}}</span>-->
                    <span class="zMoney">{{item.yearMonth}}</span>
                    <span class="zMoney">{{item.summaryAmount}}</span>
                    <span v-show="item.status===1" class="status" style="color: #4f77aa;">进行中</span>
                    <span v-show="item.status===2" class="status" style="color:#d9d9d9;">未开始</span>
                    <span v-show="item.status===3" class="status" style="color: #04be02;">已达成</span>
                    <span v-show="item.status===4" class="status" style="color: #f00;">已结束</span>
                  </van-cell>
                  <template slot="right">
                    <van-button square type="danger" text="删除" @click="deleteTask(index,item.taskId)"
                                style="width: 60px;"></van-button>
                  </template>
                </van-swipe-cell>
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
  import Vue from 'vue';
  import { Dialog } from 'vant';
  import MenuButton from '@/components/menu-button.vue';
  import { cardTask, deleteCardTask } from '@/api/work';

  Vue.use(Dialog);
  export default {
    name: 'valueIndicator',
    components: {
      MenuButton
    },
    data() {
      return {
        stateList: [
          {
            value: 0,
            name: '全部',
          },
          {
            value: 1,
            name: '进行中',
          },
          {
            value: 2,
            name: '未开始',
          },
          {
            value: 3,
            name: '已达成',
          },
          {
            value: 4,
            name: '未达成',
          },
        ],
        stateIndex: 0,
        pageSize: 20,
        pageNumber: 1,
        list: [],
        isLoading: false,

        finished: false,
        loading: false,
        total: 0,
      };
    },
    created() {
      this.stateIndex = parseInt(this.$route.query.stateIndex);
      this.getRecruitTask();
    },
    activated() {
      this.stateIndex = parseInt(this.$route.query.stateIndex);
      this.pageNumber = 1;
      this.getRecruitTask();
    },
    methods: {
      changeState(id) {
        //防止重复加载
        if (this.stateIndex === id) return;
        this.stateIndex = id;
        this.pageNumber = 1;
        //动态设置路由参数
        let path = this.$router.history.current.path;
        this.$router.replace({
          path,
          query: { stateIndex: this.stateIndex }
        });
        this.list = [];
        this.getRecruitTask();
      },
      async getRecruitTask() {
        try {
          const { data } = await cardTask({
            pageSize: this.pageSize,
            pageNumber: this.pageNumber,
            status: this.stateIndex,
          });
          this.list = data.list;
          this.isLoading = false;
        } catch {
          this.list = [];
          this.isLoading = false;
        }
      },
      create() {
        this.$router.push({
          name: 'valueCardAdd',
          query: {
            create: true,
            stateIndex: this.stateIndex
          }
        });
      },
      toDetail(taskId, status) {
        this.$router.push({
          name: 'valueCardAdd',
          query: {
            taskId,
            status,
            stateIndex: this.stateIndex
          }
        });
      },
      async deleteTask(index, id) {
        await Dialog.confirm({
          message: '确定删除吗？'
        });
        await deleteCardTask({
          taskId: id,
        });
        this.$toast({
          message: '删除成功',
          duration: 800,
          type: 'success'
        });
        this.list.splice(index, 1);
      },
      onRefresh() {
        setTimeout(() => {
          this.pageNumber = 1;
          this.getRecruitTask();
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
            cardTask({
              pageSize: this.pageSize,
              pageNumber: this.pageNumber,
              status: this.stateIndex,
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
    },
  };
</script>

<style scoped lang="scss">
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
