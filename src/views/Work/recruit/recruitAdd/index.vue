<template>
  <body>
  <div class="multiple_store_header" v-show="type !==3">
    <van-button type="default" size="small" :class="[selectStore.length !==0?'select screen':'select']"
                @click="openStorePopup" >店铺选择
    </van-button>
  </div>

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
    <!--分配的时候店长可查看-->
    <template  v-if="type===3 && !isCreate">
      <div class="create_item">
        <span>待分配金额</span>
        <div class="input">
          <span style="color:#909399">{{summaryAmount}}</span>
        </div>
      </div>
      <div class="create_item">
        <span>未分配金额</span>
        <div class="input">
          <span style="color:#909399">{{summaryAmount-total}}</span>
        </div>
      </div>
    </template>
  </div>

  <main ref="wrapper">
    <div class="mm-content">
      <div class="create mm-content_head" style="margin-top: 10px;">
        <div class="create_item">
          <span class="titleColor">会员招募指标分配</span>
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
                   placeholder="请输入招募指标"
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

  <div class="sendTask" v-if="type==3">
    <div class="count">
      <span>合计:</span>
      <span class="number">{{total}}</span>人
    </div>
    <van-button type="danger" class="del" @click="deleteTask" v-show="!isCreate && isModify===1" :disabled="isDisabled">删除</van-button>
    <van-button type="primary" class="send" @click="send" :disabled="isDisabled">
      <i v-show="!taskId">提交任务</i>
      <i v-show="taskId">保存修改</i>
    </van-button>
  </div>
  <template v-else>
    <div class="sendTask">
      <van-button
        type="default"
        size="large"
        color="#4F77AA"
        :loading="btnSendLoading"
        loading-text="正在提交任务..."
        @click="send"
      >提交任务</van-button>
    </div>
  </template>

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
      type="date"
      v-model="currentDate1"
      :formatter="formatter"
      @cancel="cancelStart"
      @confirm="confirmStart"></van-datetime-picker>
  </van-popup>
  <!--  结束时间-->
  <van-popup
    v-model="showEndTime"
    position="bottom">
    <van-datetime-picker
      type="date"
      v-model="currentDate2"
      :min-date="minDate"
      :formatter="formatter"
      @cancel="cancelEnd"
      @confirm="confirmEnd"></van-datetime-picker>
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
      <input type="number" v-model.number.trim="multiple"
             id="inputs"
             placeholder="请输入指标"
             @keyup.enter="confirmMultiple"
             style="width: 100%;height: 100%">
    </div>
  </van-dialog>

  <!--  筛选店铺-->
  <van-popup v-model="show" position="right" style="height: 100%;width:80%;z-index: 9999"
             @close="closePopup" get-container="body">
    <div class="box">
      <van-cell style="background:#f4f4f4 ">店铺列表</van-cell>
      <van-cell>
        <div class="store_input">
          <input type="text" v-model.trim="storeName" placeholder="请输入店铺名称/店铺编号">
          <van-icon name="close" size="20" v-show="storeName" @click.native="clearStoreName"/>
        </div>
        <div class="store_search" @click="searchStore">查询</div>
      </van-cell>

      <div class="main" id="main">
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="storeList.length===0?'没有匹配到相应的店铺~':'没有更多了~'"
          @load="onLoad"
          :offset="10"
          :immediate-check="false"
        >
          <template v-if="storeList.length !==0">
            <van-checkbox-group v-model="selectStore"   :max="10" >
              <van-cell v-for="(item,index) in storeList" :key="index" >
                <van-checkbox
                  :name="item.storeNo"
                  ref="checkboxes"
                  shape="square"
                  label-position="right"
                  checked-color="#4F77AA">
                  {{item.storeName}}
                </van-checkbox>
              </van-cell>
            </van-checkbox-group>
          </template>

        </van-list>
        <yd-backtop bottom="100px"></yd-backtop>
      </div>
      <div class="bottom">
        <van-button size="small" id="reset" @click="reset">重置</van-button>
        <van-button type="info" size="small " @click="sure">确定</van-button>
      </div>
    </div>
  </van-popup>
  </body>
</template>

<script>
import BScroll from 'better-scroll';
import Vue from 'vue';
import { Dialog } from 'vant';
import {
  storePeople, // 店铺人员
  deleteRecruitTask, // 删除任务
  addRecruitTask, // 新增任务
  taskRecruitDetail, // 任务详情
  updateRecruitTask, // 修改
  recruitStoreList, // 店铺列表
  addAgencyTask, // 经销商
} from '@/api/work';

Vue.use(Dialog);
export default {
  name: 'recruitAdd',
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
      type: parseInt(window.localStorage.getItem('type')), // 用户类型   1管理员 2总部人员 3店长  4店员 5经销商 6督导 7分公司人员
      btnSendLoading: false, // type !==3提交任务按钮状态
      summaryAmount: '', // 待分配金额
      taskId: '',
      isCreate: false,
      stateIndex: '',
      isModify: '', // 0不可修改  1修改  2分配
      isDisabled: false,

      // 任务年月
      currentDate: new Date(),
      showYearMonth: false,
      yearMonth: new Date().format('yyyy-MM'),
      minYearMonth: new Date(),

      // 店铺筛选
      show: false,
      pageSize: 15,
      pageNumber: 1,
      storeList: [], // 分页店铺
      allStoreList: [], // 所有店铺
      selectStore: [],
      storeName: '',
      loading: false,
      finished: false,
    };
  },
  created() {
    this.taskId = this.$route.query.taskId;
    if (this.$route.query.create) this.isCreate = JSON.parse(this.$route.query.create);
    this.stateIndex = this.$route.query.stateIndex;// 新增
    this.setMinDate(this.startTime);// 设置结束日期的最小时间

    // 获取店长拥有的权限
    if (this.type === 3) {
      this.isModify = this.$route.query.isModify;
    }
    // 店长  不是新增的时候获取任务信息
    if (this.type === 3 && !this.isCreate) {
      this.yearMonth = this.$route.query.yearMonth;
      this.taskName = this.$route.query.taskName;
      this.summaryAmount = parseInt(this.$route.query.summaryAmount); // 待分配金额
    }
    if (!this.taskId && this.type === 3) { // 店长新增
      this.getStorePeople(); // 店员信息
    } else if (this.type == 3 && this.isModify === 2) { // 店长分配
      this.editTask(this.taskId); // 获取分配信息
      // taskItem有数据说明已分配  否则为未分配

      // if (this.taskItem.length === 0) {
      //   await this.getStorePeople();
      // }
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
    } else {
      // 店长编辑
      this.editTask(this.taskId);
      if (this.isModify === 0) {
        this.isDisabled = true; // 没有修改权限
      } else if (this.status === 3 || this.status === 4) {
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
    }

    // 新增
    // if (!this.taskId) {
    //   this.getStorePeople();
    // } else {
    //   // 编辑
    //   this.editTask(this.taskId);
    //   this.status = parseInt(this.$route.query.status);
    //   if (this.status === 3 || this.status === 4) {
    //     // 3达成 4结束
    //     if (this.status === 3) {
    //       this.$toast('该任务已达成');
    //     } else if (this.status === 4) {
    //       this.isDisabled = true;
    //       this.$toast('该任务已结束');
    //     }
    //   } else {
    //     this.isDisabled = false;
    //   }
    // }
  },
  mounted() {
    // 滚动效果  解决ios光标错位
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
      });
    });
    document.body.addEventListener('focusout', () => {
      setTimeout(() => {
        const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 100);
    });
  },
  methods: {
    // 任务年月
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
    // 设置最小日期
    setMinDate(time) {
      // minDate类型问题（ios不兼容）
      const arr = time.split('-');
      const year = arr[0];
      const month = arr[1] - 1;
      const day = arr[2];
      this.minDate = new Date(year, month, day);
    },
    // 编辑
    editTask(id) {
      if (!id) return;
      taskRecruitDetail({
        taskId: this.taskId,
      })
        .then(({ data }) => {
          this.taskName = data.taskName;
          this.total = data.summaryAmount;
          this.yearMonth = data.yearMonth;
          this.taskItem = data.taskItem;
          // 判断是否有分配信息
          if (this.type == 3) {
            if (!this.taskItem || this.taskItem.length === 0) {
              this.getStorePeople();
            }
          }
        })
        .catch(() => {
          this.taskName = '';
          this.total = 0;
          this.taskItem = [];
          this.yearMonth = '';
        });
    },
    // 获取店铺人员信息
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
    // 开始时间
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
      // 编辑
      if (this.taskId) {
        if (this.startTime >= this.endTime) {
          this.endTime = this.startTime;
        }
      } else { // 新增
        this.endTime = this.startTime;
      }
      this.setMinDate(this.startTime);
    },
    // 结束时间
    showEndTimePopup() {
      if (this.status === 4) return;
      this.showEndTime = true;
    },
    cancelEnd() {
      this.showEndTime = false;
    },
    confirmEnd(value) {
      this.endTime = value.format('yyyy-MM-dd');
      this.showEndTime = false;
    },
    // 批量添加
    multipleAdd() {
      if (this.status === 4) return;
      this.showAdd = true;
      this.multiple = '';
    },
    // 重置
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
    },
    // 提交任务
    send() {
      if (this.taskName === '') {
        this.$toast({
          message: '请输入任务名称！',
          duration: 1000,
        });
        return;
      }
      if (this.total === 0) {
        this.$toast({
          message: '请分配招募会员!',
          duration: 1000,
        });
        return;
      }
      if (this.startTime > this.endTime) {
        this.$toast({
          message: '开始时间不能大于结束时间，请重新选择！',
          duration: 2000,
        });
        return;
      }
      if (!this.taskId && this.type == 3) {
        addRecruitTask({
          taskName: this.taskName,
          summaryAmount: this.total,
          yearMonth: this.yearMonth,
          taskItem: this.taskItem,
        })
          .then(({ msg }) => {
            this.$toast({
              message: `${msg}`,
              duration: 800,
              type: 'success',
            });
            setTimeout(() => {
              this.$router.replace({
                name: 'recruitIndicator',
                query: { stateIndex: this.stateIndex },
              });
            }, 500);
          })
          .catch(() => {
            console.log('请求失败！');
          });
      } else if (!this.taskId && this.type !== 3) { // 新增  店长以外的角色
        this.btnSendLoading = true;
        this.taskItem.forEach((item) => {
          // 修改字段
          item.summaryAmount = item.amount;
        });
        addAgencyTask({
          taskName: this.taskName,
          yearMonth: this.yearMonth,
          tasks: this.taskItem,
        })
          .then(({ msg }) => {
            this.btnSendLoading = false;
            this.$toast({
              message: msg,
              duration: 800,
              type: 'success',
            });
            setTimeout(() => {
              this.$router.replace({
                name: 'recruitIndicator',
                query: { stateIndex: this.stateIndex },
              });
            }, 500);
          })
          .catch(() => {
            this.btnSendLoading = false;
          });
      } else if ((this.total !== this.summaryAmount) && (this.isModify === 2)) {
        Dialog.confirm({
          message: '分配金额必须等于待分配金额!',
          showCancelButton: false,
        }).then(() => {

        }).catch(() => {

        });
      } else {
        // 店长 编辑/分配
        updateRecruitTask({
          taskId: this.taskId,
          taskName: this.taskName,
          summaryAmount: this.total,
          yearMonth: this.yearMonth,
          taskItem: this.taskItem,
        })
          .then(({ msg }) => {
            this.$toast({
              message: `${msg}`,
              duration: 800,
              type: 'success',
            });
            this.$router.replace({
              name: 'recruitIndicator',
              query: { stateIndex: this.stateIndex },
            });
          })
          .catch(() => {
            console.log('请求失败！');
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
    // 删除
    async deleteTask() {
      await Dialog.confirm({
        message: '确定删除吗？',
      });
      await deleteRecruitTask({
        taskId: this.taskId,
      });
      this.$toast({
        message: '删除成功',
        duration: 800,
        type: 'success',
      });
      this.$router.replace({
        name: 'recruitIndicator',
        query: { stateIndex: this.stateIndex },
      });
    },
    /**
     *  筛选
     * @Create By Huan 2020-1-14
    */
    // 关闭店铺弹框  type !==3
    closePopup() {
      let list = [];
      // this.storeList.forEach((m, n) => {
      //   this.selectStore.forEach((a, b) => {
      //     if (m.storeNo === a) {
      //       list.push(m);
      //     }
      //   });
      // });
      list = this.storeList.filter(this.isInclude);
      this.taskItem = list.map((item) => {
        // 格式化数组
        const obj = {
          executorName: item.storeName,
          storeId: item.storeNo,
          amount: 0,
        };
        return obj;
      });
    },
    // 判断店铺是否存在
    isInclude(value) {
      let check = false;
      this.selectStore.forEach((item, i) => {
        if (value.storeNo === item) {
          check = true;
        }
      });
      return check;
    },
    // 打开筛选弹框
    openStorePopup() {
      recruitStoreList({
        yearMonth: this.yearMonth,
      })
        .then(({ data }) => {
          window.localStorage.setItem('targetStoreList', JSON.stringify(data));
          this.allStoreList = this.getAllStoreList();
          this.getStoreList();
          this.show = true;
        })
        .catch(() => {
          window.localStorage.setItem('targetStoreList', JSON.stringify(''));
        });
    },
    // 获取全部店铺
    getAllStoreList() {
      return JSON.parse(window.localStorage.getItem('targetStoreList')); // 全部列表
    },
    // 获取店铺列表
    getStoreList() {
      this.loading = true;
      this.pageNumber = 1;
      this.storeList = this.pagination(this.allStoreList, this.pageNumber, this.pageSize); // 店铺列表
      this.loading = false;
      // 弹框展开才有main元素
      if (this.show) {
        // 回到顶部
        const main = document.getElementById('main');
        main.scrollTop = 0;
      }
      if (this.storeList.length >= this.allStoreList.length) {
        this.finished = true;
      } else {
        this.finished = false;
      }
    },
    // 分页
    pagination(array, pageNo, pageSize) {
      const offset = (pageNo - 1) * pageSize;
      const data = (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
      return data;
    },
    // 上拉加载
    onLoad() {
      this.loading = true;
      this.pageNumber += 1;
      setTimeout(() => {
        this.storeList = this.storeList.concat(this.pagination(this.allStoreList, this.pageNumber, this.pageSize)); // 店铺列表
        this.loading = false;
      }, 200);

      if (this.storeList.length >= this.allStoreList.length) {
        this.finished = true;
      } else {
        this.finished = false;
      }
    },
    fiter() {
      this.$emit('fiter');
      this.show = true;
    },
    sure() {
      this.show = false;
    },
    // 点击清除按钮
    clearStoreName() {
      this.storeName = '';
      this.storeList = [];
      this.allStoreList = this.getAllStoreList();
      this.getStoreList();
    },
    reset() {
      this.selectStore = [];
    },
    // 查询店铺
    searchStore() {
      if (this.storeName) {
        this.allStoreList = this.fiterStore(this.getAllStoreList(), this.storeName);
        this.storeList = [];
        this.getStoreList();
      } else {
        // 数据为空的时候查看全部数据
        this.allStoreList = this.getAllStoreList();
        this.storeList = [];
        this.getStoreList();
      }
    },
    // 筛选数据
    fiterStore(list, keyword) {
      const arr = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].storeName.indexOf(keyword) >= 0 || list[i].storeNo.indexOf(keyword) >= 0) {
          arr.push(list[i]);
        }
      }

      return arr;
    },
  },
  watch: {
    // 模糊查询店铺名称
    storeName(val) {
      if (val) {
        this.allStoreList = this.fiterStore(this.getAllStoreList(), this.storeName);
        this.storeList = [];
        this.getStoreList();
      } else {
        // 数据为空的时候查看全部数据
        this.allStoreList = this.getAllStoreList();
        this.storeList = [];
        this.getStoreList();
      }
    },
  },
};
</script>

<style lang="scss">
  @import "@/assets/style/work-public.scss";
  .store_input {
    height: vw(30);
    line-height: vw(25);
    border: 1px solid #ccc;
    border-radius: vw(5);
    /*margin-bottom: vw(10);*/
    display: inline-block;
    position: relative;
    width: vw(220);
    padding-right: vw(25);

    input {
      width: 100%;
      height: 100%;
      padding-left: vw(10);
      border: none;
    }

    .van-icon-close {
      position: absolute;
      right: vw(5);
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .store_search {
    float: right;
    height: vw(30);
    line-height: vw(30);
    color: $theme-color;
    font-size: vw(14) !important;
  }

  .store_search:active, .van-icon-close:active {
    opacity: .6;
  }

  .screen {
    background-color: $theme-color;

    span {
      color: #fff;
    }
  }


  .multiple_store_header {
    height: vw(45);
    line-height: vw(45);
    background-color: #fff;
    padding: 0 vw(10);
    font-size: vw(14);
    text-align: right;
    border-bottom: 1px solid $border_color;

    /*筛选*/
    .select {
      border: 1px solid $theme-color;
      color: $theme-color;
      border-radius: vw(6);
      line-height: 22px;
      font-size: vw(14);
      margin-left: vw(5);
      padding: vw(5);
    }

  }

  #reset {
    margin-right: vw(15);
    background: $body_background_color;
    color: #1989fa;
  }

  .bottom{
    button{
      width: vw(100);
    }
  }

</style>
