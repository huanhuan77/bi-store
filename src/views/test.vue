<template>
   <div>
     <van-button type="default" @click="share">转发</van-button>
   </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'count',
  data() {
    return {
      msg: 'hello',
    };
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    getConfig() {
      axios.post('http://wechata.honggu.cn:8990/repair/rest/sys/wechatTicket', { url: window.location.href },
        {
          headers: {
            token: 'eyJhbGciOiJIUzI1NiJ9.eyJMT0dJTl9VU0VSX0tFWSI6ImMxYjYwM2VmLWM1NDctNGFmOS04NDgzLTBkNzM3MmJhZWQzZiJ9.AGntgNGdtdZLzdoxxSYzx3YDaS3xjf0KRwLqSLJLtm8',
          },
        })
        .then((res) => {
          const { data } = res.data;
          this.$wx.config({
            beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，企业微信的corpID
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.noncestr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
            jsApiList: [
              'onMenuShareAppMessage',
              'onMenuShareWechat',
              'onMenuShareTimeline',
            ], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
          });
          console.log(22)
          this.share();
        });
    },
    share() {
      const _this = this;
      this.$wx.ready(() => {
        _this.$wx.onMenuShareAppMessage({
          title: '测试分享', // 分享标题
          desc: '测试测试', // 分享描述
          link: 'http://wechat.honggu.cn:8990/biStore/Supervisor/vipConsume', // 分享链接；在微信上分享时，该链接的域名必须与企业某个应用的可信域名一致
          imgUrl: 'http://qyh.honggu.cn:9006/pic240/H10541110.jpg', // 分享图标
          success() {
          // 用户确认分享后执行的回调函数
            this.$toast('success');
          },
          cancel() {
          // 用户取消分享后执行的回调函数
            this.$toast('fail');
            console.log(2);
          },
        });
        _this.$wx.error((res) => {
          alert(`errorMSG:${res}`);
          console.log(3);
        });
      });
    },
  },
};
</script>

<style scoped>

</style>
