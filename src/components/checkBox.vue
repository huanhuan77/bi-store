<template>
  <div>
    <div v-for="(item,index) in list" :key="index" class="item"
         :class="checkbox.includes(index)?'active':''"
         @click="check(index)">
      {{item}}
    </div>
  </div>
</template>

<script>
  export default {
    name:'checkBox',
    props:{
      list:Array,
      checkbox:Array,
    },
    methods:{
      check(i){
        let idx = this.checkbox.indexOf(i);
        //如果已经选中了，那就取消选中，如果没有，则选中
        if(idx>-1){
          this.checkbox.splice(idx,1);
        }else{
          this.checkbox.push(i);
        }
      },
    }

  };
</script>

<style lang="scss">
  .item {
    border: 1px dashed #ccc;
  }
  .active {
    background-color: $theme-color;
    color: #fff;
  }
</style>
