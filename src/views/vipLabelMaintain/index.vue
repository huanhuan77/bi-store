<template>
<body>
<NowStore @closePopup="closeStorePopup"></NowStore>

<main>
  <div class="table" style="margin-top: 10px">
    <table border="0" cellspacing="0" cellpadding="0" rules="groups">
      <tbody>
      <tr class="tableHead">
        <td width="25%">店员姓名</td>
        <td width="25%">应维护人数</td>
        <td width="25%">实际维护人数</td>
        <td width="25%">完成率</td>
      </tr>
      <template v-if="list.length !==0">
        <tr v-for="(item,index) in list" :key="index">
          <td width="25%" class="color_theme" @click="toDetail(item.emp_id,item.emp_name)">{{item.emp_name}}</td>
          <td width="25%">{{item.totalNum}}</td>
          <td width="25%">{{item.labelNum}}</td>
          <td width="25%">{{item.completRate|formatPercent}}%</td>
        </tr>
      </template>
      <tr v-else>
        <td colspan="4" class="noData">暂无数据</td>
      </tr>
      </tbody>
    </table>
  </div>
</main>
</body>
</template>

<script>
import NowStore from '@/components/nowStore.vue';
import * as vipLabel from '@/api/vipAnalysis/index';

export default {
  name: 'vipLabelMaintain',
  components: {
    NowStore,
  },
  data() {
    return {
      list: [],
      isFirstEnter: false, // 是否第一次进入，默认false
    };
  },
  created() {
    this.isFirstEnter = true;
    this.getList();
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == 'vipLabelMaintainDetail') {
      to.meta.isBack = true;
    }
    next();
  },
  activated() {
    if (!this.$route.meta.isBack || this.isFirstEnter) {
      this.list = [];
      this.getList();
    }
    this.$route.meta.isBack = false;
    this.isFirstEnter = false;
  },
  methods: {
    getList() {
      vipLabel.vipLabelMaintain({
        storeId: window.localStorage.getItem('storeId'),
      })
        .then(({ data }) => {
          this.list = data;
        })
        .catch(() => {
          this.list = [];
        });
    },
    toDetail(empId, empName) {
      this.$router.push({ name: 'vipLabelMaintainDetail', query: { empId, empName } });
    },
    closeStorePopup() {
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
  @import "@/assets/style/goodsAnalyze.scss";
</style>
