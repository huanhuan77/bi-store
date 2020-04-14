<template>
  <body>
  <main>
    <div class="mm-content">
      <div class="itemBox" v-for="(item,index) in menuList" :key="index" v-show="item.show">
        <div class="contentBox ">
          <div class="content_h">{{item.title}}</div>
          <div class="content_main ">
            <MemberTypeButton :memberTypeList="item.children" @changeMember="changeList"></MemberTypeButton>
          </div>
        </div>
      </div>
    </div>
  </main>
  </body>
</template>

<script>
import axios from 'axios';
import { baseUrl, url } from '../../../public/configUrl/index.js';
import MemberTypeButton from '@/components/member-type-button.vue';
import { getMenu } from '@/api/userInfo/index';

export default {
  name: 'Supervisor',
  components: {
    MemberTypeButton,
  },
  data() {
    return {
      mobile: window.localStorage.getItem('username'),
      menuList: [], // 菜单栏
      colorList: [{ color: '#fa6d6b' }, { color: '#0198ff' }, { color: '#ee914a' }],
    };
  },
  created() {
    this.getMenu();
  },
  methods: {
    getMenu() {
      const data = JSON.parse(window.localStorage.getItem('menuList'));
      const list = data.filter(item => item.path === '/');
      this.menuList = list[0].children;
      this.menuList.forEach((item) => {
        if (item.children !== undefined) {
          item.show = true;
          item.children.forEach((a, i) => {
            a.value = i + 1;
            a.name = a.title;
            a.icon = `iconfont yuan ${a.icon}`;
            if (this.colorList[i] === undefined) {
              a.style = this.colorList[i - 3];
            } else {
              a.style = this.colorList[i];
            }
            a.color = { color: '#000' };
          });
        } else {
          item.show = false;
        }
      });
    },
    handleGotoBi(method, tokenUrl, data = {}, href) {
      axios({
        method,
        url: tokenUrl,
        data,
      })
        .then(({ data }) => {
          window.location.href = `${href}?:token=${data.data}`;
        })
        .catch(() => {
          this.$toast({
            message: 'token获取失败',
            duration: 800,
          });
        });
    },
    changeList(id, path) {
      switch (path) {
        case '/workMain/areaInventorySearch':// 商品分析 库存查询
          this.$router.push({ name: 'areaInventorySearch' });
          break;
        case '/vipConsumption':// 会员分析 会员招募
          this.$router.push({ name: 'vipConsumption' });
          break;
        case '/vipBirthday':// 会员分析 会员生日
          this.$router.push({ name: 'vipBirthday' });
          break;
        case '/vipServices':// 会员分析 会员服务
          this.$router.push({ name: 'vipServices' });
          break;
        case '/vipConsume': // 会员分析 会员消费
          this.$router.push({ name: 'vipConsume' });
          break;
        case '/vipLabelMaintain': // 会员分析  会员标签维护
          this.$router.push({ name: 'vipLabelMaintain' });
          break;
        case '/totalPerformance':// 零售分析  总业绩分析
          this.$router.push({ name: 'totalPerformance' });
          break;
        case '/clerkAnalyze':// 零售分析  店员分析
          this.$router.push({ name: 'clerkAnalyze' });
          break;
        case '/bestsellerRank': // 商品分析  畅销款排名
          this.$router.push({ name: 'bestsellerRank' });
          break;
        case '/areaInventoryAnalyze': // 商品分析 库存分析
          this.$router.push({ name: 'areaInventoryAnalyze' });
          break;
        default:
          this.handleGotoBi('post', baseUrl, { mobile: this.mobile }, `${url}${path}`);
      }
    },
  },
};
</script>

<style scoped lang="scss">
  .mm-content {
    //首页项目的样式
    .itemBox {
      background: #fff;
      margin-top: vw(8);
      padding: vw(10);

      .contentBox {
        width: vw(350);
        border: 1px solid #c3d3e8;
        margin: 0 auto;
        border-radius: vw(4);
        overflow: hidden;

        .content_h {
          padding: vw(10);
          font-weight: 600;
          border-bottom: 1px solid $tableBorder;
          text-align: center;
        }

        .yingxiao {
          .member_button {
            .item:last-child {
              span {
                color: #ccc;
              }
            }
          }
        }
      }
    }
  }
</style>
