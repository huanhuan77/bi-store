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
  import {getMenu} from '@/api/userInfo/index'
  import MemberTypeButton from '@/components/member-type-button.vue'

  export default {
    name: 'workMain',
    components: {
      MemberTypeButton,
    },
    data() {
      return {
        menuList: [],//菜单列表
        colorList: [{color: '#fa6d6b'}, {color: '#0198ff'}, {color: '#ee914a'}],
      }
    },
    created() {
      this.getMenu()
    },
    methods: {
      changeTable() {
        this.$toast({
          message: '该功能正在开发中,敬请期待!',
          duration: 800,
        })
      },
      getMenu() {
        let data = JSON.parse(window.localStorage.getItem('menuList'))
        let list = data.filter((item) => {
          return item.path === '/workMain'
        })
        this.menuList = list[0].children
        this.menuList.forEach((item) => {
          if (item.children !== undefined) {
            item.show = true
            item.children.forEach((a, i) => {
              a.value = i + 1
              a.name = a.title
              a.icon = `iconfont yuan ${a.icon}`
              if (this.colorList[i] === undefined) {
                a.style = this.colorList[i - 3]
              } else {
                a.style = this.colorList[i]
              }
              a.color = {color: '#000'}
            })
          } else {
            item.show = false
          }
        })
      },
      changeList(id, path) {
        switch (path) {
          case '/workMain/performanceIndicator'://业绩指标
            this.$router.push({
              name: 'performanceIndicator',
              query: {stateIndex: 0},
            })
            break
          case '/workMain/recruitIndicator'://招募指标
            this.$router.push({
              name: 'recruitIndicator',
              query: {stateIndex: 0},
            })
            break
          case '/workMain/valueIndicator'://储值卡指标
            this.$router.push({
              name: 'valueIndicator',
              query: {stateIndex: 0},
            })
            break
          case '/workMain/myPerformanceIndicator'://我的任务
            this.$router.push({
              name: 'myPerformanceIndicator',
            })
            break
          case '/memberMain/memberDetail'://会员查询
            this.$router.push({
              name: 'memberDetail',
              query: {show: true},
            })
            break
          case '/workMain/areaInventorySearch'://区域库存查询
            this.$router.push({name: 'areaInventorySearch'})
            break
          case '/workMain/goodSearch'://商品查询
            this.$router.push({name: 'goodSearch'})
            break
          case '/workMain/storeSearch'://店铺查询
            this.$router.push({name: 'storeSearch'})
            break
          case '/workMain/couponList'://已发券列表
            this.$router.push({
              name: 'couponList',
              query: {list: true}
            })
            break
          case '/memberMain/shop'://到店发券
            this.$router.push({
              name: 'memberDetail',
              query: {
                show: true,
                shop: true,//到店发券
              },
            })
            break
          case '/workMain/registration': //会员注册
            this.$router.push({name: 'registration'})
            break
        }
      },
    },
  }
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
