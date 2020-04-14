<template>
  <div class="buttomItem">
    <div
      :class="name=='store' ?'active_button' :''"
      @click="changeTab('store')"
      v-if="type !=4 && !noStore">{{names.storeName}}
    </div>
    <div
      :class="name=='person' ?'active_button' :''"
      @click="changeTab('person')"
      v-if="type !=2">{{names.personName}}
    </div>
  </div>

</template>

<script>
  export default {
    name: 'store-person',
    props: {
      names: Object,
      // active: Number,
      noStore: Boolean,//判断是在店铺进入的还是个人进入的
      name: String,
    },
    data() {
      return {
        type: '',
      };
    },
    created() {
      this.type = window.localStorage.getItem('type');
    },

    methods: {
      changeTab(name) {
        this.$emit('changeTab', name);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .buttomItem {
    /*font-weight: 600;*/
    padding: 0 vw(10);
    height: vw(35);
    line-height: vw(35);
    background: #fff;
    display: flex;

    div {
      font-size: vw(14);
      text-align: center;
      height: vw(30);
      margin-right: vw(20);
      padding: 0 vw(10);
    }
  }
</style>
