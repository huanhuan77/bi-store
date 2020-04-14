<template>
  <body>
  <main>
    <!--<p class="huiyuan">会员注册</p>-->
    <div class="create">
      <div class="create_item">
        <i>*</i>
        <span>手机号</span>
        <div class="input">
          <input type="text" placeholder="请输入手机号" v-model="vipMobile" @blur="yanzheng1">
        </div>
      </div>
      <div class="create_item">
        <i>*</i>
        <span>姓&nbsp;&nbsp;&nbsp;名</span>
        <div class="input">
          <input type="text" placeholder="请输入姓名" v-model="username">
        </div>
      </div>
      <div class="create_item">
        <i>*</i>
        <span>生&nbsp;&nbsp;&nbsp;日</span>
        <div class="input" @click="showDatePopup">
          <span style="color:#909399">{{birthday||'请选择生日'}}</span>
          <van-icon name="arrow"></van-icon>
        </div>
      </div>
      <div class="createItem">
        <span>性&nbsp;&nbsp;&nbsp;别</span>
        <yd-radio-group v-model="gender" size="15" color="#4F77AA">
          <yd-radio val="1" style="font-size: 13px;">男</yd-radio>
          <yd-radio val="2" style="font-size: 13px;">女</yd-radio>
          <!--<yd-radio val="0" style="font-size: 13px;">保密</yd-radio>-->
        </yd-radio-group>
      </div>
      <!--<div class="create_item">-->
      <!--<span>邮&nbsp;&nbsp;&nbsp;箱</span>-->
      <!--<div class="input">-->
      <!--<input type="text" placeholder="请输入邮箱" v-model="email">-->
      <!--</div>-->
      <!--</div>-->
    </div>
    <!--<div class="bottomButton">-->
    <!--<van-button color="#4F77AA" size="large" round>保存</van-button>-->
    <!--<van-button type="default" size="large" round>取消</van-button>-->
    <!--</div>-->
  </main>
  <div class="sureTi">
    <van-button type="default" class="cancel" @click="$router.go(-1)">取消</van-button>
    <van-button color="#4F77AA" class="sure" @click="submit">保存</van-button>
  </div>
  <!--任务年月-->
  <van-popup
    v-model="showDate"
    position="bottom">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      :formatter="formatter"
      @cancel="cancel"
      @confirm="confirm">
    </van-datetime-picker>
  </van-popup>
  </body>
</template>

<script>
  import { vipRegist } from '@/api/work';

  export default {
    name: 'registration',
    data() {
      return {
        vipMobile: '',
        username: '',
        birthday: '',
        showDate: false,
        currentDate: new Date(),
        minDate: new Date(1970, 0, 1),
        gender: '1',//1男 2女 0保密
        email: '',
      };
    },
    created() {

    },
    methods: {
      formatter(type, value) {
        if (type === 'year') {
          return `${value}年`;
        }
        if (type === 'month') {
          return `${value}月`;
        }
        if (type === 'day') {
          return `${value}日`;
        }
        return value;
      },
      // 任务年月
      showDatePopup() {
        this.showDate = true;
      },
      cancel() {
        this.showDate = false;
      },
      confirm(value) {
        this.birthday = value.format('yyyy-MM-dd');
        this.showDate = false;
      },
      yanzheng1() {
        if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.vipMobile))) {
          this.$toast({
            message: '请输入正确的手机号码!',
            duration: 1000,
          });
          this.vipMobile = '';
        }
      },
      submit() {
        if (this.vipMobile === '') {
          this.$toast({
            message: '请输入手机号码！',
            duration: 1000,
          });
          return;
        }
        if (this.username === '') {
          this.$toast({
            message: '请输入姓名！',
            duration: 1000,
          });
          return;
        }
        if (this.birthday === '') {
          this.$toast({
            message: '请输入生日！',
            duration: 1000,
          });
          return;
        }
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (!reg.test(this.email) && this.email !== '') {
          this.$toast({
            message: '请输入正确的邮箱！',
            duration: 1000,
          });
          return;
        }
        vipRegist({
          tel: this.vipMobile,
          customerName: this.username,
          birthday: this.birthday,
          channelNo: window.localStorage.getItem('channelNo'),//渠道代码(注册渠道)
          userCode: window.localStorage.getItem('iposUserid'),//专属店员
          regUserCode: window.localStorage.getItem('iposUserid'),//注册店员
          gender: this.gender,//性别
          email: this.email,//邮箱
        })
          .then(({ msg }) => {
            this.$toast({
              message: `${msg}`,
              duration: 800,
            });
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "@/assets/style/work-public.scss";

  .create {
    /*margin: vw(6);*/
    /*border-radius: vw(8);*/
    /*min-height: vw(360);*/
    /*background-color: #fff;*/
  }

  .huiyuan {
    line-height: vw(40);
    padding: 0 vw(20);
    color: #ccc;
  }

  .sureTi {
    display: flex;

    .van-button {
      width: 50%;
    }
  }

  .bottomButton {
    width: 100%;
    padding: vw(30) vw(20);

    .van-button {
      margin-top: vw(10);
    }
  }

  .van-radio-group {
    display: flex;
    width: 100%;

    .van-radio {
      /*width: 33.33%;*/
    }
  }

  .createItem {
    padding: vw(10) vw(10);
    background-color: #fff;
    display: flex;
    align-items: center;

    span {
      display: inline-block;
      width: 24%;
      padding-left: vw(15);
    }
  }

  .yd-radio {
    width: vw(55);
  }

</style>
