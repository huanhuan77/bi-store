<template>
  <div class="buttomItem2 ">
    <div size="small" v-for="type in typeList"
         :class="[typeIndex==type.value?'active_button':'']"
         :key="type.value" @click="changeType(type.value)"
    >{{type.name}}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'menu-button',
    props: {
      typeIndex: Number,
      typeList: Array,
    },
    data() {
      return {};
    },
    methods: {
      changeType(id) {
        this.$emit('changeType', id);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .buttomItem2 {
    padding: 0 vw(7);
    height: vw(35);
    line-height: vw(35);
    background: #fff;
    display: flex;
    div {
      font-size: vw(13);
      text-align: center;
      height: vw(30);
      padding: 0 vw(7);
      margin-right: vw(15);
    }
  }
</style>
