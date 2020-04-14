<template>
  <body>
<!--  <div class="table tableHead" style="margin-top: 0">-->
<!--    <table border="0" cellspacing="0" cellpadding="0" rules="groups">-->
<!--      <tbody>-->
<!--      <tr>-->
<!--        <td width="30%">员工id</td>-->
<!--        <td width="30%">员工名称</td>-->
<!--        <td width="30%">招募人数</td>-->
<!--      </tr>-->
<!--      </tbody>-->
<!--    </table>-->
<!--  </div>-->
  <main>
    <div class="table tableHead" style="margin-top: 0">
      <table border="0" cellspacing="0" cellpadding="0" rules="groups">
        <tbody>
        <tr>
          <td width="30%">员工id</td>
          <td width="30%">员工名称</td>
          <td width="30%">招募人数</td>
        </tr>
        </tbody>
      </table>
    </div>
    <template v-if="list.length !==0">
    <div class="table">
      <table border="0" cellspacing="0" cellpadding="0" rules="groups">
        <tbody>
        <tr v-for="(item,index) in list" :key="index" >
          <td width="30%" style="color: #4F77AA" @click="getEmpList(item.empId,item.empName)">{{item.empId}}</td>
          <td width="30%">{{item.empName}}</td>
          <td width="30%">{{item.total}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    </template>
    <template v-else>
      <div class="noData">
        暂无数据
      </div>
    </template>

    <van-sticky :offset-top="offsetTop">
      <div class="list_header">
        <div class="list_box">
          <span class="list_name">
            {{empName}}招募会员列表
          </span>
          <span class="list_name">({{empList.length}}人)</span>
        </div>
      </div>
    </van-sticky>
    <div class="mm-content">
      <div class="go_or_down_list" style="margin-top: 0;" >
        <template v-if="empList.length!==0">
          <div class="list_main">
            <div class="list_item" v-for="(vip,index) in empList"
                 :key="index" @click="vipDetail(vip.vipMobile)">
              <div class="img">
                <img
                  v-if="vip.vipGrade==='积分卡'"
                  style="height: 100%;width: 100%"
                  src="@/assets/image/1-1.jpg"
                />
                <img
                  v-else-if="vip.vipGrade==='黄金卡'"
                  style="height: 100%;width: 100%"
                  src="@/assets/image/2-2.jpg"
                />
                <img
                  v-else
                  style="height: 100%;width: 100%"
                  src="@/assets/image/3-3.jpg"
                />
              </div>
              <div class="list_item_content">
                <p>{{vip.vipName}}</p>
                <p><span>手机号：</span><span>{{vip.vipMobile}}</span></p>
                <p><span>会员级别：</span><span>{{vip.vipGrade}}</span></p>
              </div>
            </div>
          </div>
          <div class="noData">没有更多了...</div>
        </template>
        <template v-else>
          <div class="noData">
            暂无数据
          </div>
        </template>
      </div>

    </div>

    <yd-backtop bottom="140px"></yd-backtop>
  </main>
  </body>
</template>

<script>
import { salesVipDetail, empList } from '@/api/vipAnalysis';

export default {
  name: 'currentVipConsume',
  data() {
    return {
      list: [],
      date: '',
      empList: [], // 店员招募列表
      offsetTop: 0,
      empName: '',
    };
  },
  created() {
    this.offsetTop = document.getElementsByClassName('headerBox')[0].offsetHeight - 10;
    this.date = `${this.$route.query.dateKey}-01`;
    this.getList();
  },
  methods: {
    // 本期招募详情
    getList() {
      salesVipDetail({
        dateKey: this.date,
      })
        .then(({ data }) => {
          this.list = data;
          this.getEmpList(this.list[0].empId, this.list[0].empName); // 默认第一个店员
        })
        .catch(() => {
          this.list = [];
        });
    },
    // 店员招募详情
    getEmpList(empId, empName) {
      this.empName = empName;
      empList({
        dateKey: this.date,
        empId,
      })
        .then(({ data }) => {
          this.empList = data;
        })
        .catch(() => {
          this.empList = [];
        });
    },
    vipDetail(vipMobile) {
      this.$router.push({
        name: 'memberDetail',
        query: {
          vipMobile,
          show: false,
          myMember: false,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
  @import '@/assets/style/member-public.scss';

  //图表样式
  .chart_box {
    width: 100%;
    height: vw(250);
    line-height: vw(250);
    text-align: center;
    font-size: vw(30);
    background: #fff;
    border: 1px solid $border_color;
    border-top: vw(8) solid $border_color;
    color: #ddd;
    padding: vw(5) 0;

    .chart {
      width: 100%;
      height: vw(235);

      canvas {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0);
      }
    }

    .no_data {
      height: vw(30);
      font-size: vw(30);
      font-weight: 400;
    }
  }

  //表格
  /*表头*/
  .tableHead {
    padding: 0 vw(10);
    margin-top: vw(8);
    height: auto;
    color: $gray_color;
    border-bottom: 1px solid $tableBorder;
  }


  /*滚动区域*/
  .table {
    padding: 0 vw(10);
  }

  .table {
    font-size: vw(13);
    height: auto;
    background: #fff;
    padding: 0 vw(10);

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
.tableTitle{
  height: vw(40);
  line-height: vw(40);
  background: #fff;
  padding-left: vw(20);
  margin-top:10px;
  border-bottom: 1px solid $border_color;
}
</style>
