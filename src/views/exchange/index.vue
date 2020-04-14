<template>
  <body>
  <div class="content">
    <p>您即将绑定一个新的专属导购</p>
    <p>导购姓名: <span>{{userName}}</span></p>
    <span>是否确认变更？</span>
  </div>
  <div class="box">
    <van-button color="rgba(79, 119, 170, 0.8)" round @click="handleSure" class="button" :disabled="isSuccess">确认变更
    </van-button>
  </div>
  <van-dialog
    v-model="show"
    title="是否确认变更导购？"
    show-cancel-button
    close-on-click-overlay
    :before-close="beforeClose"
    @cancel="cancel"
    @confirm="confirm">
  </van-dialog>
  </body>
</template>

<script>
  import {getGuideInfo, guideChanges} from '@/api/exchange/index'
  import { Toast, Loading } from 'vue-ydui/dist/lib.rem/dialog';
  export default {
    name: "index",
    data() {
      return {
        name: '',
        // name: '',
        show: false,
        vip_code: '',
        user_code: '',
        userName: '',
        data: '',
        isSuccess: false,
      }
    },
    created() {
      this.vip_code = this.$route.query.vip_code
      this.user_code = this.$route.query.user_code
      this.getGuideInfo()
    },
    methods: {
      //获取名字
      getGuideInfo() {
        Loading.open('加载中');
        getGuideInfo({
          vip_code: this.vip_code,
          user_code: this.user_code
        }).then(({data}) => {
          Loading.close();
          this.userName = data.user_name
          this.data = data
        }).catch(() => {
          Loading.close();
          this.userName = ''
        })
      },
      //确认导购
      guideChanges() {
        Loading.open('加载中');
        guideChanges(this.data).then(({msg}) => {
          Loading.close();
          this.isSuccess = true
          this.$toast({
            message: `${msg}`,
            type: 'success'
          })
          // 退出当前页面，回到公众号
          WeixinJSBridge.call('closeWindow');
        }).catch(() => {
          Loading.close();
          this.isSuccess = false
        })
      },
      handleSure() {
        this.show = true
      },
      cancel() {
        this.show = false
      },
      confirm() {
        this.guideChanges()
      },
      beforeClose(action, done) {
        if (action === 'confirm') {
          setTimeout(done, 500)
        } else {
          done()
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  body {
    height: 100%;
    background-color: #fff;

    .content {
      height: 40%;
      display: flex;
      /*justify-content: center;*/
      align-items: center;
      flex-direction: column;
      padding-top: vw(60);

      p {
        font-size: vw(18);
        font-weight: 500;
        line-height: vw(30);

        span {
          color: #fd962a;
        }
      }

      span {
        margin-top: vw(30);
        color: #969799;
      }
    }

    .box {
      background-color: #fff;
      height: 60%;
    }

    .button {
      margin: vw(30) vw(20);
      font-size: vw(16);
    }
  }
</style>
