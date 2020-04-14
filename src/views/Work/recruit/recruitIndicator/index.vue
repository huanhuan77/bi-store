<template>
  <body>
  <div class="createIcon" v-show="authority.isAdd">
    <span class="iconfont icon-xinzeng2" @click="create"></span>
  </div>
  <NowStore @closePopup="closePopup" v-show="type !==3"></NowStore>
  <MenuButton :typeList="stateList" @changeType="changeState"
              :typeIndex="stateIndex" class="stateList">
  </MenuButton>
  <div class="table tableHead">
    <table border="0" cellspacing="0" cellpadding="0" rules="groups">
      <tbody>
      <tr>
        <td width="25%" style="height: 30px;">任务名称</td>
        <td width="25%" style="height: 30px;">任务年月</td>
        <td width="25%" style="height: 30px;">招募人数</td>
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
              <tr v-for="(item,index) in list" :key="index" @click="toDetail(item.taskId,item.status,item)">
                <van-swipe-cell :right-width="60" class="vanCell">
                  <van-cell>
                    <span :class="type===3?'line1 color_theme':'line1'">{{item.taskName}}</span>
                    <span class="time">{{item.yearMonth}}</span>
                    <span :class="type===3 ?'zMoney':'zMoney color_theme'" @click="modifyAmount(item)">{{item.summaryAmount}}</span>
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
  <!--   添加金额指标-->
  <van-dialog
    v-model="showAmountDialog"
    title="请输入指标"
    closeOnPopstate
    show-cancel-button
    :beforeClose="beforeAmountClose">
    <div class="multiple_add">
      <input type="number"
             v-model.number.trim="taskItem.summaryAmount"
             id="inputs"
             placeholder="请输入指标"
             style="width: 100%;height: 100%;padding: 0;"
             @touchstart.native.stop="showNumberKeyboard = true"
      />
    </div>
  </van-dialog>
  <van-number-keyboard
    v-model="taskItem.summaryAmount"
    :show="showNumberKeyboard"
    @blur="showNumberKeyboard = false"
  />
  </body>
</template>

<script>
import Vue from 'vue';
import { Dialog } from 'vant';
import MenuButton from '@/components/menu-button.vue';
import { recruitTask, deleteRecruitTask,modifyRecruit } from '@/api/work';
import NowStore from '../../../../components/nowStore';

Vue.use(Dialog);
export default {
  name: 'recruitIndicator',
  components: {
    NowStore,
    MenuButton,
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
      isFirstEnter: false, // 是否第一次进入，默认false

      // 权限
      authority: {
        isAdd: '', // 是否有新增权限
        isModify: '', // 0 不能修改 1修改 2分配
      },
      // 指标信息
      taskItem: {
        summaryAmount: '', // 指标金额
        taskName: '',
        yearMonth: '',
        taskId: 0,
      },
      showAmountDialog: false,
      showNumberKeyboard: false, // 数字键盘
      type: parseInt(window.localStorage.getItem('type')),

    };
  },
  created() {
    this.isFirstEnter = true;
    this.stateIndex = parseInt(this.$route.query.stateIndex);
    this.getRecruitTask();
  },
  activated() {
    // 如果不是返回 且  不是第一次进来
    if (!this.$route.meta.isBack && !this.isFirstEnter) {
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;
      this.taskItem = {
        summaryAmount: '', // 指标金额
        taskName: '',
        yearMonth: '',
        taskId: 0,
      };
    }
    this.stateIndex = parseInt(this.$route.query.stateIndex);
    this.pageNumber = 1;
    this.getRecruitTask();
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == 'recruitAdd') {
      to.meta.isBack = true;
    }
    next();
  },
  methods: {
    changeState(id) {
      // 防止重复加载
      if (this.stateIndex === id) return;
      this.stateIndex = id;
      this.pageNumber = 1;
      // 动态设置路由参数
      const { path } = this.$router.history.current;
      this.$router.replace({
        path,
        query: { stateIndex: this.stateIndex },
      });
      this.list = [];
      this.getRecruitTask();
    },
    async getRecruitTask() {
      try {
        const { data } = await recruitTask({
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
          status: this.stateIndex,
        });
        this.list = data.list;
        this.authority.isAdd = data.isAdd;
        this.authority.isModify = data.isModify;
        this.isLoading = false;
      } catch {
        this.list = [];
        this.isLoading = false;
      }
    },
    create() {
      this.$router.push({
        name: 'recruitAdd',
        query: {
          create: true,
          stateIndex: this.stateIndex,
        },
      });
    },
    // 店长角色跳到编辑页面
    toDetail(taskId, status, item) {
      if (this.type === 3) {
        this.$router.push({
          name: 'recruitAdd',
          query: {
            taskId,
            status,
            stateIndex: this.stateIndex,
            isModify: this.authority.isModify, // 0 不可修改 1修改 2分配
            yearMonth: item.yearMonth,
            taskName: item.taskName,
            summaryAmount: item.summaryAmount,
          },
        });
      }
    },
    // 修改指标金额  type !==3
    modifyAmount(item) {
      if (this.type !== 3) {
        // 没有修改权限 结束状态不能修改
        if (this.authority.isModify !== 1 || item.status === 4) {
          if (this.authority.isModify !== 1) {
            this.$toast('sorry，您没有修改权限!');
          }
          if (item.status === 4) {
            this.$toast('任务结束,不能修改!');
          }
          this.showAmountDialog = false;
        } else {
          this.showAmountDialog = true;
          this.taskItem.summaryAmount = item.summaryAmount.toString(); // 转为字符串
          this.taskItem.taskName = item.taskName;
          this.taskItem.yearMonth = item.yearMonth;
          this.taskItem.taskId = item.taskId;
        }
      }
    },
    // 确定修改金额  type !==3
    beforeAmountClose(action, done) {
      if (action === 'confirm') {
        if (!this.taskItem.summaryAmount) {
          this.$toast.fail('指标不能为空!');
          done(false);
        } else {
          modifyRecruit({
            summaryAmount: this.taskItem.summaryAmount,
            taskName: this.taskItem.taskName,
            id: this.taskItem.taskId,
          })
            .then(({ msg }) => {
              this.$toast({
                message: msg,
                duration: 800,
                type: 'success',
              });
              this.pageNumber = 1;
              this.getRecruitTask();
            });
          done();
        }
      } else {
        done();
      }
    },
    async deleteTask(index, id) {
      await Dialog.confirm({
        message: '确定删除吗？',
      });
      await deleteRecruitTask({
        taskId: id,
      });
      this.$toast({
        message: '删除成功',
        duration: 800,
        type: 'success',
      });
      this.list.splice(index, 1);
    },
    onRefresh() {
      setTimeout(() => {
        this.pageNumber = 1;
        this.getRecruitTask();
      }, 500);
    },
    closePopup() {
      this.pageNumber = 1;
      this.getRecruitTask();
    },
    onLoad() {
      if (this.list.length < this.pageSize) {
        this.loading = false;
        this.finished = true;
      } else {
        const { list } = this;
        setTimeout(() => {
          this.pageNumber += 1;
          recruitTask({
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

    }
    .color_theme{
      color: #0F90D2;
    }
    .status {
      width: 25%;
    }
  }
</style>
