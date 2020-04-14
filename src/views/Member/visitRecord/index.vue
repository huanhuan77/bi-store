<template>
  <body>
  <main>
    <div class="create">
      <div class="createItem">
        <span>姓名:</span>
        <p>{{vip.vipName}}</p>
      </div>
      <div class="createItem">
        <span>手机号:</span>
        <p @click="call" style="color: #10AEFF">{{vip.vipMobile}}</p>
      </div>
      <div class="createItem">
        <span>等级:</span>
        <p>{{vip.vipGrade}}</p>
      </div>
      <div class="createItem">
        <span>当期回访</span>
        <yd-radio-group v-model="vip.isReturn" size="15" color="#4F77AA">
          <yd-radio val="1" style="font-size: 13px;" :disabled="flag">是</yd-radio>
          <yd-radio val="0" style="font-size: 13px;" :disabled="flag">否</yd-radio>
        </yd-radio-group>
      </div>
      <div class="createItem" v-if="vip.returnEmpName">
        <span>回访人:</span>
        <p>{{vip.returnEmpName}}</p>
      </div>
      <div class="createItem" v-if="vip.returnVisitDate">
        <span>回访日期:</span>
        <p>{{vip.returnVisitDate}}</p>
      </div>

      <div class="table" style="margin-top: 10px">
        <table border="0" cellspacing="0" cellpadding="0" rules="groups">
          <tbody>
          <tr class="tableHead">
            <td width="25%">应回访月份</td>
            <td width="25">应回访店员</td>
            <td width="25">是否回访</td>
            <td width="25">回访日期</td>
          </tr>
          <template v-if="list.length !==0">
            <tr v-for="(item,index) in list" :key="index">
              <td width="25%" style="color: #10AEFF" @click="toDetail(item.yearMonth)" v-if="status+1==99">{{item.yearMonth}}</td>
              <td width="25%" style="color: #10AEFF" @click="toDetail(item.creatDate)" v-else>{{item.creatDate}}</td>
              <td width="25%">{{item.empName}}</td>
              <td width="25%">{{item.isReturn}}</td>
              <td width="25%">{{item.visitDate}}</td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="4" class="noData">暂无数据</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="item">
        <van-cell-group>
          <van-field
            v-model="vip.content"
            :readonly="flag"
            rows="20"
            autosize
            type="textarea"
            clearable
            maxlength="200"
            placeholder="请填写回访详情..."
            show-word-limit></van-field>
        </van-cell-group>
      </div>
    </div>
  </main>
  <div class="sureTi" v-if="!flag">
    <van-button type="default" class="cancel" @click="$router.go(-1)">取消</van-button>
    <van-button color="#4F77AA" class="sure" @click="submit">提交</van-button>
  </div>
  <!--展示弹出层-->
  <van-popup v-model="showTel" class="callTel" round>
    <div>
      <a :href='`tel:${vip.vipMobile}`'>
        <van-icon name="phone-o"></van-icon>
        呼叫</a>
      <a :href='`sms:${vip.vipMobile}`'>
        <van-icon name="comment-o"></van-icon>
        发送短信</a>
    </div>
  </van-popup>

  </body>
</template>

<script>
import { vipBirthdaysReturnRecord, setVipBirthdaysReturn } from '@/api/vip';
import { remindReturnRecord, setRemindReturn, remindReturnDetail } from '@/api/sales';

export default {
  name: 'visitRecord',
  data() {
    return {
      // pageSize: 1,
      // pageNumber: 1,
      vip: {
        content: '',
      }, // 会员信息
      status: 0,
      date: new Date().format('yyyy-MM-dd'),
      index: 0,
      // placeholder: '请说明未回访原因...',
      empId: '',
      // birthday: '',
      flag: false, // 判断是否是经销商
      isOneSeven: false, // 判断是否是170点击过来的
      showTel: false,
      list: [],
      yearMonth: '', // 会员生日
      creatDate: '',
    };
  },
  created() {
    if (this.$route.query.vipNum) this.vipNum = this.$route.query.vipNum;
    if (this.$route.query.status) this.status = parseInt(this.$route.query.status);
    // if (this.$route.query.birthday) this.birthday = this.$route.query.birthday;
    if (this.$route.query.isOneSeven) this.isOneSeven = JSON.parse(this.$route.query.isOneSeven);
    if (this.$route.query.flag) {
      this.flag = new Boolean(this.$route.query.flag); // 字符串转为布尔值
    }
    if (!this.flag) this.empId = window.localStorage.getItem('iposUserid');

    if (this.status + 1 === 99) {
      this.yearMonth = this.$route.query.yearMonth;
    } else {
      this.createDate = this.$route.query.createDate;
      console.log(this.createDate);
    }
    this.getDetail();
    // if (!this.isOneSeven) {
    //   //生日
    //   this.getVipBirthdaysReturnRecord();
    // } else {
    //   //1730
    //   this.getRemindReturnRecord();
    // }
  },
  methods: {
    call() {
      this.showTel = true;
    },
    // 生日
    // getVipBirthdaysReturnRecord() {
    //   vipBirthdaysReturnRecord({
    //     pageSize: this.pageSize,
    //     pageNumber: this.pageNumber,
    //     vipNum: this.vipNum,
    //   })
    //     .then(({ data }) => {
    //       if (data.returnRecord.length !== 0) {
    //         this.returnRecord = data.returnRecord[0];
    //         if (this.returnRecord.content === null) this.returnRecord.content = '';
    //         this.vip = {
    //           vipName: data.returnRecord[0].vipName,
    //           vipMobile: data.returnRecord[0].vipMobile,
    //           vipType: data.returnRecord[0].vipType,
    //           birthday: data.returnRecord[0].birthday,
    //           returnVisit: data.returnRecord[0].returnVisit,
    //         };
    //       }
    //     })
    //     .catch(() => {
    //       console.log('获取失败！');
    //     });
    // },
    // 1730
    // getRemindReturnRecord() {
    //   remindReturnRecord({
    //     pageSize: this.pageSize,
    //     pageNumber: this.pageNumber,
    //     vipNum: this.vipNum,
    //     status: this.status,
    //   })
    //     .then(({ data }) => {
    //       if (data.returnRecord.length !== 0) {
    //         this.returnRecord = data.returnRecord[0];
    //         if (this.returnRecord.content === null) this.returnRecord.content = '';
    //         this.vip = {
    //           vipName: data.returnRecord[0].vipName,
    //           vipMobile: data.returnRecord[0].vipMobile,
    //           vipType: data.returnRecord[0].vipType,
    //           birthday: data.returnRecord[0].birthday,
    //           returnVisit: data.returnRecord[0].returnVisit,
    //         };
    //       }
    //     })
    //     .catch(() => {
    //       console.log('获取失败!');
    //     });
    // },    // getRemindReturnRecord() {
    //   remindReturnRecord({
    //     pageSize: this.pageSize,
    //     pageNumber: this.pageNumber,
    //     vipNum: this.vipNum,
    //     status: this.status,
    //   })
    //     .then(({ data }) => {
    //       if (data.returnRecord.length !== 0) {
    //         this.returnRecord = data.returnRecord[0];
    //         if (this.returnRecord.content === null) this.returnRecord.content = '';
    //         this.vip = {
    //           vipName: data.returnRecord[0].vipName,
    //           vipMobile: data.returnRecord[0].vipMobile,
    //           vipType: data.returnRecord[0].vipType,
    //           birthday: data.returnRecord[0].birthday,
    //           returnVisit: data.returnRecord[0].returnVisit,
    //         };
    //       }
    //     })
    //     .catch(() => {
    //       console.log('获取失败!');
    //     });
    // },
    // 会员回访详情
    getDetail() {
      console.log(this.status + 1 != 99);
      console.log(this.createDate);
      remindReturnDetail({
        empId: this.empId,
        vipNum: this.vipNum,
        type: this.status + 1, // 1次日 2七天 3三十天 99生日
        yearMonth: this.status + 1 == 99 ? this.yearMonth : '',
        creatDate: this.status + 1 !== 99 ? this.createDate : '',
      })
        .then(({ data }) => {
          // this.vip = {
          //   vipMobile: data.vipMobile,
          //   isReturn: data.isReturn,
          //   vipName: data.vipName,
          //   returnVisitDate: data.returnVisitDate,
          //   returnEmpName: data.returnEmpName,
          //   content: data.content,
          //   vipGrade: data.vipGrade,
          //   birthday: data.birthday,
          // };
          if (data.remind) {
            this.vip = data.remind;
          }
          this.list = data.dataList;
        });
    },
    toDetail(time) {
      if (this.status + 1 === 99) {
        this.yearMonth = time; // 生日
      } else {
        this.creatDate = time;
      }

      this.getDetail();
    },
    submit() {
      if (this.vip.content === '') {
        this.$toast({
          message: '请输入回访信息',
          duration: 800,
        });
        return;
      }
      if (!this.isOneSeven) {
        // 生日
        setVipBirthdaysReturn({
          vipNum: this.vipNum,
          empId: this.empId,
          birthday: this.vip.birthday,
          returnVisitDate: this.date,
          content: this.vip.content,
          isReturn: parseInt(this.vip.isReturn),
        })
          .then(({ msg }) => {
            this.$toast({
              message: `${msg}`,
              duration: 800,
            });
            setTimeout(() => {
              this.$router.go(-1);
            }, 2000);
          });
      } else {
        // 1730
        setRemindReturn({
          vipNum: this.vipNum,
          empId: this.empId,
          type: parseInt(this.status) + 1,
          isReturn: parseInt(this.vip.isReturn),
          returnVisitDate: this.date,
          content: this.vip.content,
        })
          .then(({ msg }) => {
            this.$toast({
              message: `${msg}`,
              duration: 800,
            });
            setTimeout(() => {
              this.$router.go(-1);
            }, 2000);
          })
          .catch(() => {
            console.log('提交失败！');
          });
      }
    },
  },
};
</script>

<style scoped lang="scss">
  @import "@/assets/style/work-public.scss";

  .createItem {
    padding: vw(10);
    background-color: #fff;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $border_color;

    span {
      width: 25%;
    }

  }

  .item {
    margin-top: vw(8);

    .textarea {
      width: 100%;
    }
  }

  .yd-radio {
    width: vw(55);
  }

  .sureTi {
    display: flex;

    .van-button {
      width: 50%;
    }
  }

  .callTel {
    width: 80%;

    a {
      font-size: vw(18);
      height: vw(60);
      line-height: vw(60);
      padding: 0 vw(30);
      border-bottom: 1px solid $border_color;
      display: flex;
      justify-content: start;
      align-items: center;

      i {
        font-size: vw(18);
        margin-right: vw(10);
      }
    }
  }

</style>
