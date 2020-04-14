<template>
  <div class="time_buttons">
    <div
      v-for="time in timeList" :key="time.value"
      :class="[timeIndex==time.value?'time_active':'']"
      @click="changeTime(time.value)"
    >{{time.name}}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'time-button',
    props: {
      timeList: Array,
      timeIndex: Number,
    },
    methods: {
      changeTime(id) {
        this.$emit('changeTime', id);
      },
    },

  };
</script>

<style scoped lang="scss">
  .time_buttons {
    width: 100%;
    font-size: vw(14);
    height: vw(32);
    line-height: vw(32);
    display: flex;
    border: 1px solid $theme-color;
    background-color: #fff;
    color: $theme-color;
    border-radius: vw(20);
    overflow: hidden;

    div {
      flex-grow: 1;
      text-align: center;
      overflow: hidden;
    }
    div~ div {
      border-left: 1px solid $theme-color;
    }
    .time_active {
      background: $theme-color ;
      color: #fff
    }
  }


</style>
