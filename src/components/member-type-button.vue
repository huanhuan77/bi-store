<template>
  <div class="member_button" :style="isMember?'':'flex-wrap:wrap;'">
    <div class="item"
         :class="[memberTypeIndex==memberType.value ?'active':'']"
         v-for="memberType in  memberTypeList"
         @click="changeMember(memberType.value,memberType.path)"
    >
      <div class="iconfont" :class="memberType.icon" :style="memberType.style"></div>
      <span :style="memberType.color">{{memberType.name}}</span>
    </div>
  </div>
  <!--v-if="type!=4 || myTask"-->
</template>

<script>
  export default {
    name: 'type-button',
    props: {
      memberTypeList: Array,
      memberTypeIndex: Number,
      // type: String,
      // myTask: Boolean,
      isMember: Boolean //会员详情页面的标签不需要换行
    },
    methods: {
      changeMember(id, path) {
        this.$emit('changeMember', id, path);
      },
    },

  };
</script>

<style scoped lang="scss">
  .member_button {
    padding: vw(2) vw(6);
    display: flex;
    position: relative;

    .item {
      width: vw(110);
      padding: vw(10);
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      font-size: vw(14);
      text-align: center;

      .iconfont {
        font-size: vw(20);
      }

      .yuan {
        width: vw(46);
        height: vw(46);
        background-color: #fff;
        border-radius: 50%;
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.05);
        margin: 0 auto;
        text-align: center;
        line-height: vw(46);
        font-size: vw(24);
      }
    }
  }

  .active {
    border-bottom: 2px solid $theme-color;
    color: $theme-color;
  }
</style>
