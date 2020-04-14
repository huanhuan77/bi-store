<template>
  <body>
  <div class="member_search" >
    <span>手机号：</span>
    <input type="text" class="input" placeholder="请输入手机号" v-model="vipMobile">
    <van-button type="default" class="search_button" @click="search">查询</van-button>
  </div>
  <template v-if="vipData.length!==0">
    <div class="member_info">
      <div class="img">
        <img
          v-if="vipData.vipType==='积分卡'"
          style="height: 100%;width: 100%"
          src="@/assets/image/1-1.jpg"
        />
        <img
          v-else-if="vipData.vipType==='黄金卡'"
          style="height: 100%;width: 100%"
          src="@/assets/image/2-2.jpg"
        />
        <img
          v-else-if="vipData.vipType==='铂金卡'"
          style="height: 100%;width: 100%"
          src="@/assets/image/3-3.jpg"
        />
      </div>
      <div class="member_info_detail">
        <p>
          <span>姓名：</span>
          <span>{{vipData.vipName}}</span>
        </p>
        <p>
          <span>手机：</span>
          <span>{{vipData.vipMobile}}</span>
        </p>
      </div>
      <div class="member_info_detail">
        <p>
          <span>会员等级：</span>
          <span>{{vipData.vipType}}</span>
        </p>
        <p>
          <span>可用积分：</span>
          <span>{{vipData.availableIntegral}}</span>
        </p>
      </div>
    </div>
    <MemberTypeButton :memberTypeList="typeList" :memberTypeIndex="memberIndex"
                      @changeMember="changeMember"></MemberTypeButton>
    <!-- 消费明细 表头-->
    <div class="cost_item_header" v-if="memberIndex===3">
      <div class="table tableHead">
        <table border="0" cellspacing="0" cellpadding="0" rules="groups">
          <tbody>
          <tr>
            <td width="25%">日期</td>
            <td>单据编号</td>
            <td width="15%">数量</td>
            <td width="15%">金额</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--优惠券 表头-->
    <div class="cost_item_header" v-if="memberIndex===2||memberIndex===5">
      <van-tabs v-model="tabs_active" :line-height="2" color="#4F77AA" title-active-color="#4F77AA" @click="changeTab">
        <van-tab title="优惠券"></van-tab>
        <van-tab title="储值卡"></van-tab>
      </van-tabs>
      <div class="table tableHead">
        <table border="0" cellspacing="0" cellpadding="0" rules="groups">
          <!--优惠券-->
          <tbody v-if="tabs_active==0">
          <tr>
            <td width="25%">优惠券号</td>
            <td>描述</td>
            <td width="20%">是否使用</td>
          </tr>
          </tbody>
          <!--储值卡-->
          <tbody v-if="tabs_active==1">
          <tr>
            <td width="25%">储值卡号</td>
            <td>累计消费金额</td>
            <td width="20%">当前余额</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <main>
      <div class="mm-content">
        <!-- 详细资料-->
        <div class="detail" v-if="memberIndex===1">
          <div class="detail_item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-qiahao"></use>
            </svg>
            <span>会员卡号：</span>
            <span class="gray">{{tabList.vipNum}}</span>
          </div>
          <div class="detail_item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zu"></use>
            </svg>
            <span>性别：</span>
            <span class="gray">{{tabList.sex||'男'}}</span>
          </div>
          <div class="detail_item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-chushengriqi"></use>
            </svg>
            <span>出生日期：</span>
            <span class="gray">{{tabList.vipBirthday}}</span>
          </div>
          <div class="detail_item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-leijixiaofeijine"></use>
            </svg>
            <span>累计消费金额：</span>
            <span class="gray">{{tabList.salesAmount}}</span>
          </div>
          <div class="detail_item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-riqi"></use>
            </svg>
            <span>入会日期：</span>
            <span class="gray">{{tabList.createDate}}</span>
          </div>
          <div class="detail_item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-riqi"></use>
            </svg>
            <span>最近消费日期：</span>
            <span class="gray">{{tabList.lastDate}}</span>
          </div>

          <div class="detail_item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-icon-test"></use>
            </svg>
            <span>专属店员：</span>
            <span class="gray">{{tabList.empName}}</span>
          </div>

          <div class="detail_item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-yingxiaogongju-guanzhudianpuyouli"></use>
            </svg>
            <span>服务店铺名称：</span>
            <span class="gray">{{tabList.vipStore}}</span>
          </div>

        </div>
        <!--优惠券-->
        <div class="cost_detail" v-if="memberIndex===2||memberIndex===5">
          <template v-if="tabList.length !==0">
            <div class="table">
              <table border="0" cellspacing="0" cellpadding="0" rules="groups">
                <tbody v-if="memberIndex===2">
                <tr v-for="(list,index) in tabList" :key="index">
                  <td width="25%">{{list.coupon_code}}</td>
                  <td>{{list.coupon_name}}</td>
                  <td width="20%">{{list.is_use}}</td>
                </tr>
                </tbody>
                <tbody v-if="memberIndex===5">
                <tr v-for="(list,index) in tabList" :key="index">
                  <td width="25%">{{list.czkNum}}</td>
                  <td>{{list.xfje}}</td>
                  <td width="20%">{{list.dqje}}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template v-else>
            <div class="table_noData">暂无数据</div>
          </template>
        </div>
        <!-- 消费明细-->
        <div class="cost_detail" v-if="memberIndex===3">
          <template v-if="tabList.length !==0">
            <div class="table">
              <table border="0" cellspacing="0" cellpadding="0" rules="groups">
                <tbody>
                <tr v-for="(list,index) in tabList" :key="index">
                  <td width="25%">{{list.createDate}}</td>
                  <td style="color: #0F90D2" @click="toConsumeDetail(list.orderNum)">{{list.orderNum}}</td>
                  <td width="15%">{{list.orderQty}}</td>
                  <td width="15%">{{list.amount}}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template v-else>
            <div class="table_noData">暂无数据</div>
          </template>
        </div>
        <!--编辑标签-->
        <div class="tag" v-if="memberIndex==4">
          <div class="editTag" @click="editTag" v-if="myMember && memberIndex==4">
            <van-icon name="edit"></van-icon>
            <span>编辑标签</span>
          </div>
          <div class="tagList" @click="tagList">
            <van-icon name="apps-o"></van-icon>
            <span>标签列表</span>
          </div>
        </div>
        <!--标签信息-->
        <div class="tagInfo " v-if="memberIndex==4">
          <div class="outCircle">
            <div class="img">
              <img
                v-if="sex==='男'"
                style="height: 100%;width: 100%"
                src="@/assets/image/man.png"
              />
              <img
                v-if="sex==='女'"
                style="height: 100%;width: 100%"
                src="@/assets/image/woman.png"
              />
              <p class="age">{{age||18}}岁</p>
            </div>
          </div>
          <!--随机标签云-->
          <div class="wrap">
            <!--<svg :width='width' :height='height'>-->
            <!--<a href="#" v-for='(tag,index) in tags'>-->
            <!--<text :x='tag.x' :y='tag.y'-->
            <!--fill-opacity='1'-->
            <!--:fill="tag.color"-->
            <!--style="font-weight: 500;font-size:13px;"-->
            <!--@click="tagClick(index,tag.tag_name,tag.remark)">-->
            <!--{{tag.tag_name}}-->
            <!--</text>-->
            <!--</a>-->
            <!--</svg>-->
          </div>
          <div class="color">
            <span><i style="background-color: #ffa71e"></i>动态标签</span>
            <span><i style="background-color: #276fcc"></i>固定标签</span>
            <span><i style="background-color: #28ccb4"></i>自定义标签</span>
          </div>
          <!--动态标签-->
          <div class="dynamic" v-if="LabelList.length!=0">
            <ul>
              <li v-for="(item,index) in LabelList" :key="index" @click="tagClick(index,item.tag_name,item.remark)">
                {{item.tag_name}}
              </li>
            </ul>
          </div>
          <!--固定标签-->
          <div class="fixed" v-if="vipFixedTagList.length!=0">
            <ul>
              <li v-for="(item,index) in vipFixedTagList" :key="index">
                {{item.fixedTagName}}
              </li>
            </ul>
          </div>
          <!--自定义标签-->
          <div class="custom" v-if="vipDefinedList.length!=0">
            <ul>
              <li v-for="(item,index) in vipDefinedList" :key="index">
                {{item.tag}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </template>
  </body>
</template>

<script>
  import MemberTypeButton from '@/components/member-type-button.vue';
  import { vipDetail,vipLabel } from '@/api/vip';

  export default {
    name: 'memberSearch',
    components: {
      MemberTypeButton,
    },
    data() {
      return {
        typeList: [
          {
            value: 1,
            name: '详细资料',
            icon: 'icon-xiangxiziliao',
          },
          {
            value: 2,
            name: '优惠券',
            icon: 'icon-youhuiquan',
          },
          {
            value: 3,
            name: '消费明细',
            icon: 'icon-xiaofei',
          },
          {
            value: 4,
            name: '标签信息',
            icon: 'icon-biaoqian',
          },
        ],
        memberIndex: 1,
        pageNumber: 1,
        pageSize: 10,
        vipMobile: '',
        vipData: [],
        tabList: [],
        tabListLength: 0, // 表格长度

        width: 0, // svg宽度
        height: 0, // svg高度
        tagsNum: 6, // 标签数量
        RADIUS: 0, // 球的半径
        tags: [],
        tagsText: [],
        tagRemark: [],

        sex: '',
        age: 18,
        tabs_active: 0,
      };
    },
    created() {
      this.width = document.documentElement.clientWidth + 20;
      this.RADIUS = this.width / 2.7;
      this.height = document.documentElement.clientHeight / 2.1;
    },
    updated() {
      this.sex = window.localStorage.getItem('sex');
    },
    computed: {
      CX() { // 球心x坐标
        return this.width / 2;
      },
      CY() { // 球心y坐标
        return this.height / 2;
      },
    },
    methods: {
      tagClick(index,text,remark) {
        this.$toast({
          message: text+' --- '+remark,
          duration: 2000
        });
      },
      //获取标签信息
      getvipLabel() {
        vipLabel({
          customerCode: this.vipData.customerCode
        })
          .then((res) => {
            let Arr = [];
            let remark = [];
            for (let key in res.data) {
              Arr.push(res.data[key].tag_name);
            }
            for (let key in res.data) {
              remark.push(res.data[key].remark);
            }
            this.tagsText = Arr;
            this.tagRemark = remark;
            this.getTags();
          });
      },
      changeTab(name, title) {
        if (title == '储值卡') {
          this.memberIndex = 5;
          this.getVipDetail();
        } else {
          this.memberIndex = 2;
          this.getVipDetail();
        }
      },
      changeMember(id) {
        this.memberIndex = id;
        this.getVipDetail();
      },
      getVipDetail() {
        vipDetail({
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          vipMobile: this.vipMobile,
          tabIndex: this.memberIndex,
        })
          .then((res) => {
            if (res.data.vipData == 0 || res.data.vipData == []) {
              this.$toast(res.msg);
            } else {
              this.vipData = res.data.vipData[0];
              this.tabList = this.memberIndex == 1 ? res.data.tabList[0] : res.data.tabList;
              if (this.memberIndex == 1) {
                window.localStorage.setItem('sex', this.tabList.sex || '男');
                return;
              }
              if (this.memberIndex == 4) {
                if (this.tabList.length == 0) return this.age = 18;
                this.getvipLabel()
                this.age = this.tabList[0].age;
              }
            }
          });
      },
      search() {
        this.vipMobile = this.vipMobile.trim();
        if (this.vipMobile == '') {
          this.$dialog.toast({
            mes: '请输入手机号码',
            timeout: 800,
          });
          return;
        }
        this.getVipDetail();
      },
      toConsumeDetail(number) {
        this.$router.push({
          name: 'consumeDetail',
          query: { number }
        });
      },
      getTags() {
        const tags = [];
        for (let i = 0; i < this.tagsText.length; i++) {
          const tag = {};
          const k = -1 + (1.2 * (i + 1) - 1) / this.tagsNum;
          const a = Math.acos(k);
          const b = a * Math.sqrt(this.tagsNum * Math.PI);// 计算标签相对于球心的角度
          tag.text = this.tagsText[i];
          tag.remark = this.tagRemark[i];
          tag.color = this.getColor();
          tag.x = this.CX + this.RADIUS * Math.sin(a) * Math.cos(b) * 1;// 根据标签角度求出标签的x,y坐标
          tag.y = this.CY + this.RADIUS * Math.sin(a) * Math.sin(b) * 1;
          tags.push(tag);
        }
        this.tags = tags;// 让vue替我们完成视图更新
      },
      getColor() {
        // rgb颜色随机
        const r = Math.floor(Math.random() * 200);
        const g = Math.floor(Math.random() * 200);
        const b = Math.floor(Math.random() * 100);
        const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
        return color;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .member_button {
    background-color: #fff;
  }

  /*会员查询*/
  .member_search {
    padding: 0 vw(10);
    font-size: vw(14);
    height: vw(50);
    line-height: vw(50);
    background: #fff;
    margin-top: vw(8);
    position: relative;

    .input {
      display: inline-block;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: vw(200);
      height: vw(40);
      /*line-height: vw(20);*/
      border: none;
      background: #F7F8FA;
      padding: vw(5);
      box-sizing: border-box;
    }

    .search_button {
      background: $theme-color;
      color: #fff;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: vw(30);
      font-size: vw(14);
      width: vw(60);
      height: vw(40);
      line-height: vw(40);
    }
  }

  /*会员信息*/
  .member_info {
    font-size: vw(14);
    height: vw(100);
    background: #fff;
    margin-top: vw(8);
    padding: 0 vw(10);
    position: relative;
    display: flex;

    div {
      margin: auto;
      flex-grow: 1;

      p {
        height: vw(30);
        line-height: vw(30);
      }
    }

    .img {
      width: vw(90);
    }

  }

  /*表格样式*/
  /*表头  不滚动*/
  .tableHead {
    font-size: vw(14);
    background: #fff;
    margin-top: vw(8);
    height: vw(30);
    line-height: vw(30);
    color: $gray_color;
    border-bottom: 1px solid #E5E5E5;
  }

  .table {
    padding: 0 vw(8);
    font-size: vw(14);
    height: auto;
    background: #fff;

    table {
      width: 100%;

      td {
        border-bottom: 1px solid #E5E5E5;
        text-align: center;
        height: vw(30);
        line-height: vw(30);
        text-overflow: ellipsis;
        vertical-align: middle;
      }
    }
  }

  /*内容滚动区域*/
  .mm-content {
    /*height: 100%;*/
    /*padding: 0 vw(8);*/
    /*background: #fff;*/

    /*详细资料*/
    .detail {
      background: #fff;
      padding-left: vw(40);
      margin-top: vw(8);

      .gray {
        color: $gray_color;
      }

      .detail_item {
        height: vw(37);
        line-height: vw(37);
        border-bottom: 1px solid $border_color;
        position: relative;

        .icon {
          font-size: vw(20);
          position: absolute;
          left: vw(-30);
          top: 50%;
          transform: translateY(-50%);
        }

      }

      .detail_item:last-child {
        border-bottom: none;
      }
    }

    .cost_detail {
      .cost_item {
        text-align: center;
        height: vw(30);
        line-height: vw(30);
        display: flex;
        border-bottom: 1px solid $border_color;

        span {
          width: vw(80);
          flex-grow: 1;
        }
      }

      .cost_item:last-child {
        border-bottom: none;
      }

      .table_noData {
        height: vw(30);
        line-height: vw(30);
        text-align: center;
        background: #fff;
        color: $gray_color;
      }
    }

    /*标签信息*/
    .tagInfo {
      background: #fff;
      margin-top: vw(10);
      height: vw(300);
      position: relative;

      .outCircle {
        height: vw(80);
        width: vw(80);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        .img {
          text-align: center;

          img {
            width: 100%;
            height: 100%;
          }

          .age {
            padding: vw(2) vw(4);
            border-radius: 10px;
            display: inline-block;
            color: #fff;
            font-size: 12px;
            background-color: $theme-color;
          }
        }
      }

      .wrap {
        position: absolute;
        z-index: 2;
        padding: vw(10);

        svg {
          margin-left: -20px;
          margin-top: -24px;

          a {
            display: inline-block;
            border: 1px solid #ddd;
            background-color: red;
          }
        }
      }
    }

  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
</style>
