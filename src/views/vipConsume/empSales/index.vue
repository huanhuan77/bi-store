<template>
  <body>
  <div class="table tableHead">
    <table border="0" cellspacing="0" cellpadding="0" rules="groups">
      <tbody>
      <tr>
        <td width="16%">店员姓名</td>
        <td width="17%"><div style="height: 20px;">会员</div> <span>消费金额</span></td>
        <td width="17%"><div style="height: 20px;">会员</div> <span>消费数量</span></td>
        <td width="20%">总销售金额</td>
        <td width="20%">总销售数量</td>
      </tr>
      </tbody>
    </table>
  </div>

  <main>
    <div class="mm-content">
      <template v-if="list.length!==0">
        <div class="table">
          <table border="0" cellspacing="0" cellpadding="0" rules="groups">
            <tbody>
            <tr v-for="(item,index) in list" :key="index">
              <td width="16%">{{item.empName|formatAmount}}</td>
              <td width="17%">{{item.vipAmount|formatAmount}}</td>
              <td width="17%">{{item.vipOrderQty|formatAmount}}</td>
              <td width="20%">{{item.amount|formatAmount}}</td>
              <td width="20%">{{item.qty|formatAmount}}</td>
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
    </div>
  </main>
  </body>
</template>

<script>
import { empSale } from '@/api/vipAnalysis';

export default {
  name: 'index',
  data() {
    return {
      list: [],
      storeId: '',
      startDate: '',
      endDate: '',
    };
  },
  created() {
    this.storeId = this.$route.query.storeId;
    this.startDate = this.$route.query.startDate;
    this.endDate = this.$route.query.endDate;

    this.getList();
  },
  methods: {
    getList() {
      empSale({
        storeId: this.storeId,
        startDate: this.startDate,
        endDate: this.endDate,
      })
        .then(({ data }) => {
          this.list = data;
        })
        .catch(() => {
          this.list = [];
        });
    },
  },

};
</script>

<style scoped lang="scss">
  /*不滚动内容*/
  .tableHead {
    padding: 0 vw(10);
    font-size: vw(13);
    background: #fff;
    margin-top: vw(8);
     height: auto;
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
    font-size: vw(13);
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
