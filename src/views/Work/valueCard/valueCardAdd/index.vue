<template>
  <body>
  <div class="create">
    <div class="create_item">
      <span>任务名称</span>
      <div class="input">
        <input type="text" placeholder="请输入任务名" v-model="taskName" :readonly="isDisabled">
      </div>
    </div>
    <div class="create_item">
      <span>任务年月</span>
      <div class="input" @click="showYearMonthPopup">
        <span style="color:#909399">{{yearMonth}}</span>
        <van-icon name="arrow"></van-icon>
      </div>
    </div>
    <!--<div class="create_item">-->
    <!--<span>开始时间</span>-->
    <!--<div class="input" @click="showStartTimePopup">-->
    <!--<span style="color:#909399">{{startTime}}</span>-->
    <!--<van-icon name="arrow"></van-icon>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="create_item">-->
    <!--<span>结束时间</span>-->
    <!--<div class="input" @click="showEndTimePopup">-->
    <!--<span style="color:#909399">{{endTime}}</span>-->
    <!--<van-icon name="arrow"></van-icon>-->
    <!--</div>-->
    <!--</div>-->
  </div>

  <main ref="wrapper">
    <div class="mm-content">
      <div class="create mm-content_head" style="margin-top: 10px;">
        <div class="create_item">
          <span class="titleColor">储值卡指标分配</span>
          <div class="add_del">
            <span @click="reSet">重置</span>
            <span @click="multipleAdd"> 批量添加</span>
          </div>
        </div>
      </div>
      <div class="mm-content_main">
        <div class="create_item" v-for="(item,index) in taskItem" :key="index">
          <span>{{item.executorName}}</span>
          <div class="zbInput">
            <input type="number"
                   min="0"
                   onkeyup="this.value=this.value.replace(/\D/g,'')"
                   v-model="item.amount"
                   placeholder="请输入储值卡指标"
                   @input="change(item.executorId)"
                   @blur="inputBlur"
                   :readonly="isDisabled"/>
          </div>
        </div>
        <div class="noData" v-if="taskItem.length===0">
          暂无数据
        </div>
      </div>
    </div>
  </main>

  <div class="sendTask">
    <div class="count">
      <span>合计:</span>
      <span class="number">{{total}}</span>张
    </div>
    <van-button type="danger" class="del" @click="deleteTask" v-show="!isCreate" :disabled="isDisabled">删除</van-button>
    <van-button type="primary" class="send" @click="send" :disabled="isDisabled">
      <i v-show="!taskId">提交任务</i>
      <i v-show="taskId">保存修改</i>
    </van-button>
  </div>

  <!--任务年月-->
  <van-popup
    v-model="showYearMonth"
    position="bottom">
    <van-datetime-picker
      v-model="currentDate"
      type="year-month"
      :formatter="formatter"
      :min-date="minYearMonth"
      @cancel="cancelYearMonth"
      @confirm="confirmYearMonth">
    </van-datetime-picker>
  </van-popup>


  <!--  开始时间-->
  <van-popup
    v-model="showStartTime"
    position="bottom">
    <van-datetime-picker
      v-model="currentDate1"
      type="date"
      :formatter="formatter"
      @cancel="cancelStart"
      @confirm="confirmStart">
    </van-datetime-picker>
  </van-popup>

  <!--  结束时间-->
  <van-popup
    v-model="showEndTime"
    position="bottom">
    <van-datetime-picker
      v-model="currentDate2"
      type="date"
      :min-date="minDate"
      :formatter="formatter"
      @cancel="cancelEnd"
      @confirm="confirmEnd">
    </van-datetime-picker>
  </van-popup>

  <!--  批量添加-->
  <van-dialog
    v-model="showAdd"
    title="批量添加指标"
    show-cancel-button
    :beforeClose="beforeClose"
    @confirm="confirmMultiple"
  >
    <div class="multiple_add">
      <input type="number"
             v-model.number.trim="multiple"
             id="inputs"
             @keyup.enter="confirmMultiple"
             placeholder="请输入指标"
             style="width: 100%;height: 100%">
    </div>
  </van-dialog>

  </body>
</template>

<script>
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import { Dialog } from 'vant';
  import {
    storePeople, // 店铺人员
    deleteCardTask, // 删除任务
    addCardTask, // 新增任务
    taskCardDetail, // 任务详情
    updateCardTask,//修改
  } from '@/api/work';

  Vue.use(Dialog);
  export default {
    name: 'valueCardAdd',
    data() {
      return {
        showStartTime: false,
        startTime: new Date().format('yyyy-MM-dd'),
        showEndTime: false,
        endTime: new Date().format('yyyy-MM-dd'),
        taskItem: [],
        currentDate1: new Date(),
        currentDate2: new Date(),
        showAdd: false, // 批量添加
        multiple: '', // 批量添加输入框
        total: 0, // 合计
        taskName: '', // 任务名称
        status: 0,
        minDate: 0,

        taskId: '',
        isCreate: false,
        stateIndex: '',

        isDisabled: false,

        //任务年月
        currentDate: new Date(),
        showYearMonth: false,
        yearMonth: new Date().format('yyyy-MM'),
        minYearMonth: new Date(),
      };
    },
    created() {
      this.taskId = this.$route.query.taskId;
      if (this.$route.query.create) this.isCreate = JSON.parse(this.$route.query.create);
      this.stateIndex = this.$route.query.stateIndex;//新增
      this.setMinDate(this.startTime);
      //新增
      if (!this.taskId) {
        this.getStorePeople();
      } else {
        //编辑
        this.editTask(this.taskId);
        this.status = parseInt(this.$route.query.status);
        if (this.status === 3 || this.status === 4) {
          //3达成 4结束
          if (this.status === 3) {
            this.$toast('该任务已达成');
          } else if (this.status === 4) {
            this.isDisabled = true;
            this.$toast('该任务已结束');
          }
        } else {
          this.isDisabled = false;
        }
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
      //任务年月
      showYearMonthPopup() {
        if (this.status === 4) return;
        this.showYearMonth = true;
      },
      cancelYearMonth() {
        this.showYearMonth = false;
      },
      confirmYearMonth(value) {
        this.yearMonth = value.format('yyyy-MM');
        this.showYearMonth = false;
      },


      //设置最小日期
      setMinDate(time) {
        //minDate格式问题（ios不兼容）
        let arr = time.split('-');
        let year = arr[0];
        let month = arr[1] - 1;
        let day = arr[2];
        this.minDate = new Date(year, month, day);
      },
      //编辑
      editTask(id) {
        if (!id) return;
        taskCardDetail({
          taskId: this.taskId,
        })
          .then(({ data }) => {
            this.taskName = data.taskName;
            this.total = data.summaryAmount;
            // this.startTime = data.startTime;
            // this.endTime = data.endTime;
            this.yearMonth = data.yearMonth;
            this.taskItem = data.taskItem;
            // this.status = data.status;
          })
          .catch(() => {
            this.taskName = '';
            this.total = 0;
            this.yearMonth = '';
            this.taskItem = [];
          });
      },
      getStorePeople() {
        storePeople()
          .then(({ data }) => {
            this.taskItem = data.list;
            this.taskItem.forEach((item) => {
              item.amount = 0;
            });
          })
          .catch(() => {
            this.taskItem = [];
          });
      },
      // 开始时间
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
      showStartTimePopup() {
        if (this.status === 4) return;
        this.showStartTime = true;
      },
      cancelStart() {
        this.showStartTime = false;
      },
      confirmStart(value) {
        this.showStartTime = false;
        this.startTime = value.format('yyyy-MM-dd');
        //编辑
        if (this.taskId) {
          if (this.startTime >= this.endTime) {
            this.endTime = this.startTime;
          }
        } else {//新增
          this.endTime = this.startTime;
        }
        this.setMinDate(this.startTime);
      },
      //结束时间
      showEndTimePopup() {
        if (this.status === 4) return;
        this.showEndTime = true;
      },
      cancelEnd() {
        this.showEndTime = false;
      },
      confirmEnd(value) {
        this.showEndTime = false;
        this.endTime = value.format('yyyy-MM-dd');
      },
      // 批量添加
      multipleAdd() {
        if (this.status === 4) return;
        this.showAdd = true;
      },
      //重置
      reSet() {
        if (this.status === 4) return;
        this.taskItem.forEach((item) => {
          if (item.amount) {
            item.amount = 0;
          }
          this.totalCount();
        });
      },
      // 点击确认,统计合计
      confirmMultiple() {
        // this.total = 0;
        // this.$nextTick(() => {
        //   this.taskItem.forEach((item) => {
        //     if (item.value) {
        //       this.total += parseInt(item.value);
        //     }
        //   });
        // });
      },
      // 提交任务
      send() {
        if (this.taskName === '') {
          this.$toast({
            message: '请输入任务名称！',
            duration: 1000
          });
          return;
        }
        if (this.total === 0) {
          this.$toast({
            message: '请分配储值卡张数!',
            duration: 1000
          });
          return;
        }
        if (this.startTime > this.endTime) {
          this.$toast({
            message: '开始时间不能大于结束时间，请重新选择！',
            duration: 2000
          });
          return;
        }
        if (!this.taskId) {
          addCardTask({
            taskName: this.taskName,
            summaryAmount: this.total,
            // startTime: this.startTime,
            // endTime: this.endTime,
            yearMonth: this.yearMonth,
            taskItem: this.taskItem,
          })
            .then(({ msg }) => {
              this.$toast({
                message: `${msg}`,
                duration: 800,
                type: 'success'
              });
              setTimeout(() => {
                this.$router.replace({
                  name: 'valueIndicator',
                  query: { stateIndex: this.stateIndex }
                });
              }, 500);
            })
            .catch(() => {
              console.log('请求失败！')
            });
        } else {
          updateCardTask({
            taskId: this.taskId,
            taskName: this.taskName,
            summaryAmount: this.total,
            // startTime: this.startTime,
            // endTime: this.endTime,
            yearMonth: this.yearMonth,
            taskItem: this.taskItem
          })
            .then(({ msg }) => {
              this.$toast({
                message: `${msg}`,
                duration: 800,
                type: 'success'
              });
              this.$router.replace({
                name: 'valueIndicator',
                query: { stateIndex: this.stateIndex }
              });
            })
            .catch(() => {
              console.log('请求失败！')
            });
        }
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
            this.taskItem.forEach((item) => {
              item.amount = parseInt(item.amount) + this.multiple;
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
      change() {
        this.totalCount();
      },
      inputBlur() {
        this.taskItem.forEach((item) => {
          if (item.amount == '') {
            item.amount = 0;
          }
        });
      },
      // 合计
      totalCount() {
        this.total = 0;
        this.taskItem.forEach((item) => {
          if (item.amount) {
            this.total += parseInt(item.amount);
          }
        });
      },
      //删除
      async deleteTask() {
        await Dialog.confirm({
          message: '确定删除吗？'
        });
        await deleteCardTask({
          taskId: this.taskId,
        });
        this.$toast({
          message: '删除成功',
          duration: 800,
          type: 'success'
        });
        this.$router.replace({
          name: 'valueIndicator',
          query: { stateIndex: this.stateIndex }
        });
      }
    },
  };
</script>

<style lang="scss" scoped>
  @import "@/assets/style/work-public.scss";
</style>
