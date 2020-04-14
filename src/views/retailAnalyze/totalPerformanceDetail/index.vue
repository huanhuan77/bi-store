<template>
  <body>
<!--  <div class="table tableHead">-->
<!--    <table border="0" cellspacing="0" cellpadding="0" rules="groups">-->
<!--      <tbody>-->
<!--      <tr>-->
<!--        <td width="20%">日期</td>-->
<!--        <td width="20%">销售金额</td>-->
<!--        <td width="18%">数量</td>-->
<!--        <td width="15%">折扣</td>-->
<!--        <td width="25%">指标完成率</td>-->
<!--      </tr>-->
<!--      </tbody>-->
<!--    </table>-->
<!--  </div>-->

  <main style="background: #fff">
<!--    <template v-if="list.length!==0">-->
<!--      <div class="table">-->
<!--        <table border="0" cellspacing="0" cellpadding="0" rules="groups">-->
<!--          <tbody>-->
<!--          <tr v-for="(item,index) in list" :key="index">-->
<!--            <td width="20%" @click="toDetail(item.dateKey)">{{item.dateKey}}</td>-->
<!--            <td width="20%">{{item.sumAmount |formatAmount}}</td>-->
<!--            <td width="18%">{{item.sumQty|formatAmount}}</td>-->
<!--            <td width="15%">{{parseInt(item.discount)}}%</td>-->
<!--            <td width="25%">{{item.percentageComplete}}%</td>-->
<!--          </tr>-->
<!--          </tbody>-->
<!--        </table>-->
<!--      </div>-->
<!--    </template>-->

<!--    <template v-else>-->
<!--      <div class="noData">-->
<!--        暂无数据-->
<!--      </div>-->
<!--    </template>-->
    <template>
      <el-table
        :data="list"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @row-click="rowClick"
        size="mini"
        :header-cell-style="getHeaderClass"
        style="width: 100%"
        @expand-change="exChange">
        <el-table-column type="expand" width="20">
          <template slot-scope="props">
            <template>
              <el-table
                size="mini"
                :data="childrenList"
                :header-cell-style="getHeaderClass"
                style="width: 100%;">
                <el-table-column
                  prop="productStyle"
                  align="center"
                  width="100"
                  label="款号">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="amount"
                  label="金额">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="discount"
                  label="折扣">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="orderQty"
                  label="数量">
                </el-table-column>
              </el-table>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          align="center"
          label="日期"
          prop="dateKey">
        </el-table-column>
        <el-table-column
          align="center"
          width="60"
          label="销售金额"
          prop="sumAmount">
        </el-table-column>
        <el-table-column
          align="center"
          width="50"
          label="数量"
          prop="sumQty">
        </el-table-column>
        <el-table-column
          align="center"
          width="60"
          label="折扣"
          prop="discount">
        </el-table-column>
        <el-table-column
          align="center"
          width="85"
          label="指标完成率"
          prop="percentageComplete">
        </el-table-column>
      </el-table>
    </template>
  </main>


  </body>
</template>

<script>
import { salesAnalyzeAmount, salesAnalyzeAmountDetail } from '@/api/retailAnalyze';

export default {
  name: 'totalPerformanceDetail',
  data() {
    return {
      list: [],
      storeId: '',
      startDate: '',
      endDate: '',
      childrenList: [],
      getRowKeys(row) {
        return row.id;
      },
      expands: [],
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
      salesAnalyzeAmount({
        storeId: this.storeId,
        firstDateKey: this.startDate,
        dateKey: this.endDate,
      })
        .then(({ data }) => {
          data.forEach((item, index) => {
            item.id = index + 1;
          });
          this.list = data;
        })
        .catch(() => {
          this.list = [];
        });
    },
    // exChange(row) {
    //   this.toDetail(row.dateKey);
    // },
    toDetail(saleDate) {
      salesAnalyzeAmountDetail({
        saleDate,
      })
        .then(({ data }) => {
          this.childrenList = data;
        })
        .catch(() => {
          this.childrenList = [];
        });
    },

    getHeaderClass({
      row, column, rowIndex, columnIndex,
    }) {
      if (rowIndex === 0) {
        return 'background:#eee;text-align:center;font-size:9px;font-weight:500;height:30px,line-height:30px';
      }
      return '';
    },
    // 点击行展开
    rowClick(row, e, column) {
      const NoIndex = column.type.indexOf('expand');
      if (NoIndex == 0 ) {
        this.expands = [];
        return;
      }

      Array.prototype.remove = function (val) {
        const index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };
      if (this.expands.indexOf(row.id) < 0) { // 确保只展开一行
        this.expands.shift();
        this.expands.push(row.id);
        this.toDetail(row.dateKey);
      } else {
        this.expands.remove(row.id);
      }

    },
    // 展开收缩事件
    exChange(row, expanded) {
      if (expanded.length) {
        this.expands = [];
        if (row) {
          this.expands.push(row.id);
          this.toDetail(row.dateKey);
        }
      } else {
        this.expands = [];
      }
    },


  },
};
</script>

<style  lang="scss">
  .el-table{
    font-size: vw(11) !important;
  }
  .el-table--mini th{
    padding: 0;
  }
  .el-table__expanded-cell[class*=cell]{
    padding: vw(5);
  }
  .el-table th>.cell{
    padding: 0;
  }
  .el-table .cell{
    padding: 0;
  }
</style>
