<template>
  <body>
  <!--<img src="@/assets/image/back.png" alt="">-->
  <!--<div class="splash">-->
  <!--&lt;!&ndash;<transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">&ndash;&gt;-->
  <!--<div class="slide">-->
  <!--<img src="@/assets/image/logo.png" alt="">-->
  <!--<div class="line"><i></i></div>-->
  <!--</div>-->
  <!--&lt;!&ndash;</transition>&ndash;&gt;-->
  <!--&lt;!&ndash;<transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">&ndash;&gt;-->
  <!--<div class="span">-->
  <!--<span>顾客至上</span>-->
  <!--<span>锐意进取</span>-->
  <!--</div>-->
  <!--&lt;!&ndash;</transition>&ndash;&gt;-->
  <!--</div>-->
  <!--&lt;!&ndash;<transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">&ndash;&gt;-->
  <!--<p>生意参谋</p>-->
  <!--&lt;!&ndash;</transition>&ndash;&gt;-->
  </body>
</template>

<script>
  export default {
    name: 'Splash',
    data() {
      return {
        visible: false,
        showSpan: false,
        time: 4000,
        timeShow: false,
        show: false,
      };
    },
    created() {
      this.visible = true;
      this.show = true;

    },
    mounted() {
      // let src = document.getElementById('img').src;
      // src = src + '?v=1';
      // console.log(src);
    },
    methods: {
      // finish() {
      //   const type = window.localStorage.getItem('type');
      //   if (type == 3 || type == 4) {
      //     this.$router.replace({ name: 'shouye' });
      //   } else {
      //     //督导 /老板
      //     this.$router.replace({ name: 'Supervisor' });
      //   }
      // },
    },
    watch: {
      '$route.path'(newVal) {
        this.show = newVal === '/';
      }
    }
  };
</script>

<style scoped lang="scss">
  body {
    width: 100%;
    background-color: #fff;
    position: relative;
    font-family: 'Microsoft YaHei', serif;
    background: url('../assets/image/back.png') no-repeat center;
    background-size: auto 100%;

    p {
      font-size: vw(16);
      color: $theme-color;
      position: absolute;
      bottom: vw(20);
      left: 50%;
      transform: translateX(-50%);
    }

    img {
      width: 100%;
      height: 100%;
    }
  }

  .tiaoguo {
    padding: vw(3) vw(10);
    border: 1px solid #f4f4f4;
    border-radius: vw(20);
    //background-color: $body_background_color;
    position: absolute;
    top: vw(-20);
    right: vw(10);
    z-index: 999;

    .van-count-down {
      color: #999;
    }
  }

  .splash {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: relative;
    /*display: flex;*/
    /*background: url("../assets/image/start.png") center top;*/

    img {
      width: 100%;
      height: 100%;
    }

    .slide {
      width: vw(170);
      margin: vw(60) auto;
      display: flex;
      align-items: center;
      flex-direction: column;
      position: relative;

      .line {
        display: block;
        width: vw(150);
        height: vw(1);
        background-color: #f6f6f6;
        position: relative;
        margin: vw(10) 0 vw(40);

        i {
          position: absolute;
          top: vw(-5);
          left: 50%;
          transform: translateX(-50%);
          width: vw(10);
          height: vw(10);
          background-color: #f6f6f6;
          border-radius: 50%;
          border: vw(3) solid #fff;
        }
      }

    }

    .span {
      width: vw(60);
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        display: block;
        font-size: vw(22);
        color: $theme-color;
        width: vw(20);
        line-height: vw(28);
        letter-spacing: vw(8);
        margin-top: vw(50);
        /*writing-mode: vertical-lr;!*从左向右 从右向左是 writing-mode: vertical-rl;*!*/
      }

      span:first-of-type {
        margin-top: vw(-100);
        margin-right: vw(20);
      }

      span:last-of-type {
        margin-left: vw(20);
      }


    }
  }

  .fade-enter-active, .fade-leave-active {
    /*transition: opacity 0.5s*/
  }

  .fade-enter, .fade-leave-to {
    /*opacity: 0*/
  }
</style>
