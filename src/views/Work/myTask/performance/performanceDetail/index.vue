<template>
  <body>
  <div class="create">
    <div class="create_item">
      <span>任务名称</span>
      <div class="input">
        <span style="color:#909399">{{taskName}}</span>
      </div>
    </div>
    <div class="create_item">
      <span>任务年月</span>
      <div class="input">
        <span style="color:#909399">{{yearMonth}}</span>
      </div>
    </div>
    <div class="create_item">
      <span>业绩指标金额</span>
      <div class="input">
        <span style="color:#f00">{{summaryAmount}}</span> 元
      </div>
    </div>
  </div>

  <main ref="wrapper">
    <div class="mm-content">
      <div class="create mm-content_head" style="margin-top: 10px;">
        <div class="create_item">
          <span style="color: #c8c9cc">业绩指标分配</span>
          <div class="add_del">
            <span @click="reSet">重置</span>
            <span @click="multipleAdd"> 批量添加</span>
          </div>
        </div>
      </div>
      <div class="mm-content_main">
        <div class="create_item" v-for="(item,index) in dateList" :key="index">
          <span>{{item.dayDate}}</span>
          <div class="input zbInput">
            <input type="number"
                   onkeyup="this.value=this.value.replace(/\D/g,'')"
                   v-model="item.dayAmount"
                   placeholder="请分配业绩指标"
                   @input="change(item.itemId)"
                   @blur="inputBlur"
                   :readonly="isDisabled"/>
          </div>
        </div>
      </div>
    </div>
  </main>

  <div class="sendTask">
    <div class="count">
      <span>合计:</span>
      <span class="number">{{total}}</span>元
    </div>
    <van-button type="primary" class="send" :disabled="isDisabled" @click="send">
      <i>分配指标</i>
    </van-button>
  </div>

  <!--  批量添加-->
  <van-dialog
    v-model="showAdd"
    title="批量添加指标"
    :beforeClose="beforeClose"
    @confirm="confirmMultiple"
    show-cancel-button>
    <div class="multiple_add">
      <input type="number"
             v-model.number.trim="multiple"
             onkeyup="this.value=this.value.replace(/\D/g,'')"
             id="inputs"
             placeholder="请输入指标"
             style="width: 100%;height: 100%;padding: 0;"/>
    </div>
  </van-dialog>

  </body>
</template>

<script>
  import BScroll from 'better-scroll';
  import { myAddTaskPer, perDateList } from '@/api/work';

  export default {
    name: 'myPerformanceDetail',
    data() {
      return {
        taskItem: [],
        showAdd: false, // 批量添加
        multiple: '', // 批量添加输入框
        total: 0, // 合计
        taskName: '', // 任务名称
        status: 0,

        itemId: '',
        taskId: '',
        yearMonth: '',
        summaryAmount: 0,
        isDisabled: false,
        empId: window.localStorage.getItem('iposUserid'),
        dateList: [],//时间列表
      };
    },
    created() {
      this.itemId = this.$route.query.itemId;
      this.taskId = this.$route.query.taskId;
      this.taskName = this.$route.query.taskName;
      this.yearMonth = this.$route.query.yearMonth;
      this.summaryAmount = this.$route.query.summaryAmount;

      this.getDateList();
      this.status = parseInt(this.$route.query.status);
      if (this.status === 3 || this.status === 4) {
        // 3达成 4结束
        if (this.status === 3) {
          this.$toast('该任务已达成');
        } else if (this.status === 4) {
          this.isDisabled = true;
          this.$toast('该任务已结束');
        }
      } else {
        this.isDisabled = false;
      }
    },
    mounted() {
      // 滚动效果  解决ios光标错位
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.wrapper, {
          click: true
        });
      });
      document.body.addEventListener('focusout', () => {
        setTimeout(() => {
          const scrollHeight =
            document.documentElement.scrollTop || document.body.scrollTop || 0;
          window.scrollTo(0, Math.max(scrollHeight - 1, 0));
        }, 100);
      });
    },
    methods: {
      //获取时间列表
      getDateList() {
        perDateList({
          yearMonth: this.yearMonth,
          itemId: this.itemId,
          taskName: this.taskName,
          taskId: this.taskId,
          empId: this.empId,
        })
          .then(({ data }) => {
            this.dateList = data.dayTaskList;
            this.total = data.dayAmountSum;

            // this.dateList.forEach((item) => {
            //   item.dayAmount = 0;
            // });
          })
          .catch(() => {
            this.dateList = [];
            this.total = 0;
          });
      },
      //提交
      send() {
        if (this.total < this.summaryAmount) {
          this.$toast({
            message: '合计金额不能小于指标金额，请重新分配指标!',
            duration: 1000,
          });
          return;
        }
        //查看分配

        //新增分配
        myAddTaskPer({
          itemId: this.itemId,
          taskId: this.taskId,
          empId: this.empId,
          dayTaskItemList: this.dateList,
          totalAmount: this.total
        })
          .then(({ msg }) => {
            this.$toast({
              message: `${msg}`,
              duration: 800,
              type: 'success',
            });
            this.$router.replace({
              name: 'myPerformanceIndicator'
            });
          });
      },
      // 批量添加
      multipleAdd() {
        if (this.status === 4) return;
        this.showAdd = true;
      },
      // 重置
      reSet() {
        if (this.status === 4) return;
        this.dateList.forEach((item) => {
          if (item.dayAmount) {
            item.dayAmount = 0;
          }
          this.totalCount();
        });
      },
      // 批量添加验证
      beforeClose(action, done) {
        if (action === 'confirm') {
          if (typeof (this.multiple) !== 'number') {
            this.$toast({
              message: '请输入数字!',
              duration: 800,
            });
            done(false);
          } else if (this.multiple >= 0) {
            this.dateList.forEach((item) => {
              item.dayAmount = parseInt(item.dayAmount) + this.multiple;
              this.totalCount();
            });
            done();
          } else {
            this.$toast({
              message: '请输入大于等于0的数字!',
              duration: 800,
            });
            done(false);
          }
        } else {
          done();
        }
      },
      confirmMultiple() {

      },
      change() {
        this.totalCount();
      },
      inputBlur() {
        this.dateList.forEach((item) => {
          if (item.dayAmount === '') {
            item.dayAmount = 0;
          }
        });
      },
      // 合计
      totalCount() {
        this.total = 0;
        this.dateList.forEach((item) => {
          if (item.dayAmount) {
            this.total += parseInt(item.dayAmount);
          }
        });
      },

    },
  };
</script>

<style lang="scss" scoped>
  @import "@/assets/style/work-public.scss";
</style>
