<template>
  <body>
  <main>
    <div class="userInfo">
      <div class="item line1">
        <span>头像</span>
        <div class="img">
          <img :src="avatar" alt="" style="width: 100%;height: 100%">
        </div>
      </div>
      <div class="item">
        <span>姓名</span>
        <span>{{userInfo.name}}</span>
      </div>
      <div class="item" v-if="userInfo.type===3 ||userInfo.type===4">
        <span>店铺</span>
        <span>{{storeName}}</span>
      </div>
      <div class="item">
        <span>职位</span>
        <span>{{role}}</span>
      </div>
      <div class="item">
        <span>手机</span>
        <span>{{userInfo.mobile}}</span>
      </div>
      <div class="item" v-if="type==3||type==4">
        <span>店铺地址</span>
        <!--<span v-if="!isEdit" :class="[type!=4?'edit':'']">{{address}}</span>-->
        <span v-if="!isEdit">{{address}}</span>
        <textarea type="text" class="" aria-placeholder="请输入店铺地址" v-model="address" ref="addressInput"
                  v-show="type!=4&&isEdit" @keyup.enter="addressEdit"></textarea>
        <van-icon name="edit" v-show="type!=4" @click="addressEdit" v-if="!isEdit" color="#00f"></van-icon>
        <van-icon name="passed" v-show="type!=4" @click="addressEdit" v-else color="#04be02"></van-icon>
      </div>
      <div class="item" v-if="type==3||type==4">
        <span>店铺电话</span>
        <span v-if="!isMEdit">{{tel}}</span>
        <input type="text" class="" aria-placeholder="请输入店铺联系电话" v-model="tel" ref="mobileInput"
               v-show="type!=4&&isMEdit" @keyup.enter="mobileEdit"/>
        <van-icon name="edit" v-show="type!=4" @click="mobileEdit" v-if="!isMEdit" color="#00f"></van-icon>
        <van-icon name="passed" v-show="type!=4" @click="mobileEdit" v-else color="#04be02"></van-icon>
      </div>

      <div class="codeLine" v-if="type==3||type==4">
        <div>
          <van-image
            fit="fill"
            width="80"
            height="80"
            :src="userInfo.regCodeUrl"
            @click="previewCodeClick(1)"></van-image>
          <div>会员注册码</div>
        </div>

        <div>
          <van-image
            width="80"
            height="80"
            :src="userInfo.qrCodeUrl"
            @click="previewCodeClick(2)"></van-image>
          <div>添加好友码</div>
        </div>
      </div>

    </div>
    <div class="logout">
      <van-button size="large" @click="logout">退出登录</van-button>
    </div>
  </main>

  <!--    会员注册码弹出层-->
  <van-popup v-model="previewCode" round :style="{ width:'80%' }">
    <div style="display: flex;flex-direction: column;justify-content: space-around">
      <!--<canvas ref="canvas" width="200" height="200" id="canvas"></canvas>-->
      <div class="userName_popup">
        <van-image
          width="50"
          height="50"
          :src="avatar"
          round></van-image>
        <span style="font-weight: bold;margin-right: 10px;">{{userInfo.name}}</span>
        <!--<span v-if="!isText">会员注册码</span>-->
        <!--<span v-else>好友码</span>-->
      </div>

      <img :src="previewImgUrl" style="width:100%;" alt="" ref="image">
      <!--<div class="scanCode" v-if="isText">扫码添加好友</div>-->
      <van-icon name="close" class="closeIcon" @click="close"></van-icon>
    </div>

  </van-popup>

  <!--修改地址和电话-->
  <van-dialog
    v-model="showEdit"
    title="编辑"
    show-cancel-button
    :beforeClose="beforeClose"
    @confirm="confirm">
    <div class="create">
      <div class="create_item">
        <span>地址</span>
        <div class="input">
          <input type="text" placeholder="请输入店铺地址" v-model="userInfo.address">
        </div>
      </div>
      <div class="create_item">
        <span>联系电话</span>
        <div class="input">
          <input type="text" placeholder="请输入联系电话" v-model="userInfo.mobile">
        </div>
      </div>
    </div>
    <!--<div class="edit">-->
    <!--<div class="item">-->
    <!--&lt;!&ndash;<span>地址</span>&ndash;&gt;-->
    <!--<input type="text" v-model="userInfo.address" placeholder="请输入地址"/>-->
    <!--</div>-->
    <!--<div class="item">-->
    <!--&lt;!&ndash;<span>联系电话</span>&ndash;&gt;-->
    <!--<input type="text" v-model="userInfo.mobile" placeholder="请输入联系电话"/>-->
    <!--</div>-->
    <!--</div>-->
  </van-dialog>

  </body>

</template>

<script>
  import { logout } from '@/api/auth';
  import { updateStore } from '@/api/user';
  import HeaderBar from '@/components/header-bar.vue';

  export default {
    name: 'userInfo',
    components: {
      HeaderBar,
    },
    data() {
      return {
        userInfo: {
          name: '',
          type: '',
          mobile: '',
        },
        address: '',
        tel: '',
        storeName: '',
        avatar: window.localStorage.getItem('avatar'),
        previewCode: false, // 图片预览 会员注册码
        previewImgUrl: '',
        isText: false, // 注册会员不用显示
        type: window.localStorage.getItem('type'),
        showEdit: false,

        addressFlag: true,
        mobileFlag: true,
        isEdit: false,//显示输入框

        isMEdit: false,
        role: '',
      };
    },
    created() {
      this.role = window.localStorage.getItem('userType');
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      // this.address = window.localStorage.getItem('address');
      if (window.localStorage.getItem('tel') === 'null' || window.localStorage.getItem('tel') === 'undefined') {
        this.tel = '';
      } else {
        this.tel = window.localStorage.getItem('tel');
      }
      if (window.localStorage.getItem('address') === 'null' || window.localStorage.getItem('address') === 'undefined') {
        this.address = '';
      } else {
        this.address = window.localStorage.getItem('address');
      }
      this.storeName = window.localStorage.getItem('storeName');
    },
    mounted() {
      document.body.addEventListener('focusout', () => {
        setTimeout(() => {
          const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
          window.scrollTo(0, Math.max(scrollHeight - 1, 0));
        }, 100);
      });
    },
    computed: {
      // role() {
      //   if (this.type == 1) {
      //     return '管理员'; // 个人  店铺
      //   } else if (this.type == 2) {
      //     return '总部人员'; // 店铺
      //   } else if (this.type == 3) {
      //     return '店长'; // 个人  店铺
      //   } else {
      //     return '店员'; // 看个人
      //   }
      // },
    },
    updated() {
      // this.initDraw()
    },
    methods: {
      logout() {
        logout()
          .then(() => {
            WeixinJSBridge.call('closeWindow');
            localStorage.clear();
          });
      },
      // 会员注册码预览
      previewCodeClick(index) {
        this.previewCode = true;
        if (index === 1) {
          this.isText = false;
          this.previewImgUrl = this.userInfo.regCodeUrl;
        } else {
          this.isText = true;
          this.previewImgUrl = this.userInfo.qrCodeUrl;
        }
      },
      close() {
        this.previewCode = false;
      },
      /**
       * Created by zyj on 2019-10-29
       * 画图
       */
      initDraw() {
        // 初始化会员注册码画布
        let img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = this.userInfo.regCodeUrl;
        let that = this;
        img.onload = function () {
          const canvas = that.$refs.canvas;
          let context = canvas.getContext('2d');
          context.font = '12px sans-serif';
          context.fillText(that.userInfo.name + '   会员注册码', 50, 30);
          context.drawImage(img, 0, 40, 200, 200);
          let url = canvas.toDataURL('image/jpg');//保存成图片
          // console.log(url);
          // let dataURL = canvas.toDataURL();
          // console.log(dataURL);
          // const imageDemo = this.$refs.imageDemo;
          // imageDemo.src = canvas.toDataURL('image/png');
        };
      },
      beforeClose(action, done) {
        if (action === 'confirm') {
          setTimeout(done, 500);
        } else {
          done();
        }
      },
      confirm() {
        // this.showEdit = false;
      },
      submit1() {
        let address = window.localStorage.getItem('address');
        if (this.address.trim() === address && this.addressFlag) return;
        if (this.address.trim() === '') {
          this.$toast({
            message: '店铺地址不能为空！',
            duration: 1000,
          });
          this.isEdit = true;
          this.address = window.localStorage.getItem('address');
          return;
        }
        //保存
        updateStore({
          id: window.localStorage.getItem('id'),
          storeNo: window.localStorage.getItem('storeNo'),
          tel: '',
          address: this.address.trim(),
        })
          .then(({ msg }) => {
            this.$toast({
              message: `${msg}`,
              duration: 1000,
            });
            this.addressFlag = false;
            window.localStorage.setItem('address', this.address);
          })
          .catch(() => {
            if (window.localStorage.getItem('address') === 'null' || window.localStorage.getItem('address') === 'undefined') {
              this.address = '';
            } else {
              this.address = window.localStorage.getItem('address');
            }
            // this.address = window.localStorage.getItem('address');
            this.addressFlag = false;
          });
      },
      submit2() {
        let mobile = window.localStorage.getItem('tel');
        if (this.tel.trim() === mobile && this.mobileFlag) return;
        if (this.tel.trim() === '') {
          this.$toast({
            message: '店铺联系电话不能为空！',
            duration: 1000,
          });
          this.isMEdit = true;
          this.tel = window.localStorage.getItem('tel');
          return;
        }
        //保存
        updateStore({
          id: window.localStorage.getItem('id'),
          storeNo: window.localStorage.getItem('storeNo'),
          tel: this.tel.trim(),
          address: '',
        })
          .then(({ msg }) => {
            this.$toast({
              message: `${msg}`,
              duration: 1000,
            });
            this.mobileFlag = false;
            window.localStorage.setItem('tel', this.tel);
          })
          .catch(() => {
            if (window.localStorage.getItem('tel') === 'null' || window.localStorage.getItem('tel') === 'undefined') {
              this.tel = '';
            } else {
              this.tel = window.localStorage.getItem('tel');
            }
            // this.tel = window.localStorage.getItem('tel');
            this.mobileFlag = false;
          });
      },
      addressEdit() {
        //保存
        if (this.isEdit) {
          this.submit1();
        }
        this.isEdit = !this.isEdit;
        this.$nextTick(() => {
          this.$refs.addressInput.focus();
        });
      },
      mobileEdit() {
        //保存
        if (this.isMEdit) {
          this.submit2();
        }
        this.isMEdit = !this.isMEdit;
        this.$nextTick(() => {
          this.$refs.mobileInput.focus();
        });
      },
    },
  };
</script>

<style scoped lang="scss">
  @import '@/assets/style/work-public.scss';

  * {
    font-size: vw(14);
  }

  /*.edit {*/
  /*width: 100%;*/
  /*padding: vw(8) vw(15);*/

  /*.item {*/
  /*display: flex;*/
  /*justify-content: center;*/
  /*align-items: center;*/
  /*margin-bottom: vw(10);*/

  /*span {*/
  /*width: 30%;*/
  /*}*/

  /*input {*/
  /*width: 70%;*/
  /*height: vw(40);*/
  /*line-height: vw(40);*/
  /*background: none;*/
  /*outline: none;*/
  /*border: 1px solid #ccc;*/
  /*border-radius: vw(10);*/
  /*padding-left: vw(10);*/
  /*}*/

  /*}*/
  /*}*/

  .item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: vw(8) 0;

    input, textarea {
      position: absolute;
      right: vw(50);
      width: 70%;
      background: none;
      outline: none;
      padding-left: vw(10);
      padding-right: vw(15);
      border: 0;
      text-align: right;
    }


    .edit {
      position: absolute;
      top: 0;
      right: vw(34);
      display: flex;
    }

    i {
      padding: vw(10) vw(12);
    }
  }

  .header_title {
    background: $theme-color;
    line-height: vw(40);
    height: vw(40);
    padding: 0 vw(10);
    color: #fff;
    text-align: center;
    position: relative;

    div {
      text-align: center;
      display: inline-block;
    }

    i {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: vw(5);

      .van-icon {
        width: vw(30);
        height: vw(40);
        line-height: vw(40);
      }
    }

    i:active {
      opacity: .6;
    }
  }

  .userInfo {
    background: #fff;
    padding: 0 vw(10);

    .item {
      width: 100%;
      background: #fff;
      border-bottom: 1px solid $border_color;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: vw(8) 0;

      span:nth-child(1) {
        width: 30%;
      }

      span:nth-child(2) {
        text-align: right;
        width: 70%;
        color: $gray_color;

        i {
          margin-left: vw(5);
        }
      }
    }

    .codeLine {
      display: flex;
      justify-content: space-evenly;
      padding: vw(10) 0;
    }

    .line1 {
      position: relative;
      height: vw(75);
      line-height: vw(75);
      border-bottom: 1px solid $border_color;

      .img {
        width: vw(60);
        height: vw(60);
        display: inline-block;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  .logout {
    padding: vw(10);
    text-align: center;

    .van-button--large {
      border-radius: 40px;
      background-color: rgba(79, 119, 170, 0.8);

      span {
        color: #fff;
        font-size: vw(15);
        letter-spacing: vw(2);
      }
    }

  }

  .van-image {
    margin: auto 0;
  }

  .scanCode {
    text-align: center;
    color: #333;
    height: vw(30);
    line-height: vw(30);
  }

  .closeIcon {
    color: #ccc;
    font-size: vw(30);
    height: vw(80);
    line-height: vw(80);
    text-align: center;

  }

  .userName_popup {
    height: vw(60);
    line-height: vw(60);
    display: flex;

    .van-image {
      margin-left: vw(15);
      margin-right: vw(15);
    }
  }
</style>
