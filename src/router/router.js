import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home/main/index.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: '/biStore/',
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/Home/login'),
      meta: {
        allowBack: false,
      },
    },
    {
      path: '/Supervisor',
      name: 'Supervisor',
      component: () => import('@/views/Supervisor/index.vue'),
      meta: {
        title: '首页',
        keepAlive: true,
        isBack: false,
        allowBack: false,
      },
    },
    // 个人信息
    {
      path: '/userInfo',
      name: 'userInfo',
      component: () => import('@/views/Home/userInfo/index.vue'),
      meta: {
        title: '个人信息',
        // keepAlive: true, // 此组件需要被缓存
        // isBack: false, // 用于判断上一个页面是哪个
      },

    },
    // 首页
    {
      path: '/home',
      name: 'shouye',
      component: Home,
      meta: {
        title: '首页',
        keepAlive: true,
        // isBack: false,
        allowBack: false,
      },
    },
    // 业绩
    {
      path: '/home/storePerformance',
      name: 'storePerformance',
      component: () => import('@/views/Home/Performance/storePerformance/index.vue'),
      meta: {
        title: '业绩',
        keepAlive: true,
        isBack: false,
      },
    },

    // 个人首页
    {
      path: '/home/personal',
      name: 'personal',
      component: () => import('@/views/Home/personal/home/index.vue'),
      meta: {
        title: '个人首页',
        keepAlive: true,
        isBack: false,
      },
    },
    // 个人业绩
    {
      path: '/home/personalPerformance',
      name: 'personalPerformance',
      component: () => import('@/views/Home/personal/personalPerformance/index.vue'),
      meta: {
        title: '个人业绩',
        keepAlive: true,
        isBack: false,
      },
    },
    // 个人会员招募
    {
      path: '/home/personalMemberRecruit',
      name: 'personalMemberRecruit',
      component: () => import('@/views/Member/personal/personalMemberRecruit/index.vue'),
      meta: {
        title: '个人会员招募',
        keepAlive: true,
        isBack: false,
      },
    },

    // 业绩详情
    {
      path: '/home/storePerformanceDetail',
      name: 'storePerformanceDetail',
      component: () => import('@/views/Home/Performance/storePerformanceDetail/index.vue'),
      meta: {
        title: '业绩详情',
        // keepAlive: true,
        isBack: false,
      },
    },
    // 会员招募
    {
      path: '/memberMain/memberRecruit',
      name: 'memberRecruit',
      component: () => import('@/views/Member/memberRecruit/index.vue'),
      meta: {
        title: '会员招募',
        keepAlive: true,
        isBack: false,
      },
    },
    // 会员招募详情
    {
      path: '/memberMain/memberRecruitDetail',
      name: 'memberRecruitDetail',
      component: () => import('@/views/Member/memberRecruitDetail'),
      meta: {
        title: '会员招募详情',
        // keepAlive: true,
        isBack: false,
      },
    },

    // 储值卡
    {
      path: '/home/valueCard',
      name: 'valueCard',
      component: () => import('@/views/Home/valueCard'),
      meta: {
        title: '储值卡',
        keepAlive: true,
        isBack: false,
      },
    },
    // 会员升降级   店铺会员
    {
      path: '/memberMain/memberUp_storeMember',
      name: 'memberUp_storeMember',
      component: () => import('@/views/Member/memberUp/memberUp_storeMember/index.vue'),
      meta: {
        title: '会员升级-店铺会员',
        keepAlive: true,
        isBack: false,
      },
    },
    // 会员升降级   我的会员
    {
      path: '/memberMain/memberUp_myMember',
      name: 'memberUp_myMember',
      component: () => import('@/views/Member/memberUp/memberUp_myMember/index.vue'),
      meta: {
        title: '会员升级-我的会员',
        keepAlive: true,
      },
    },
    // 会员1730提醒 店铺会员
    {
      path: '/memberMain/member_1730_storeRemind',
      name: 'member_1730_storeRemind',
      component: () => import('@/views/Member/member_1730/member_1730_storeRemind/index.vue'),
      meta: {
        title: '会员1730提醒',
        keepAlive: true,
        isBack: false,
      },
    },

    // 会员1730提醒 我的会员
    {
      path: '/memberMain/member_1730_myRemind',
      name: 'member_1730_myRemind',
      component: () => import('@/views/Member/member_1730/member_1730_myRemind/index.vue'),
      meta: {
        title: '会员1730提醒',
        keepAlive: true,
        isBack: false,
      },
    },

    // 会员生日  店铺会员
    {
      path: '/memberMain/memberBirthday_storeMember',
      name: 'memberBirthday_storeMember',
      component: () => import('@/views/Member/memberBirthday/memberBirthday_storeMember'),
      meta: {
        title: '会员生日-店铺会员',
        keepAlive: true,
        isBack: false,
      },
    },
    // 会员生日  我的会员
    {
      path: '/memberMain/memberBirthday_myMember',
      name: 'memberBirthday_myMember',
      component: () => import('@/views/Member/memberBirthday/memberBirthday_myMember'),
      meta: {
        title: '会员生日-我的会员',
        keepAlive: true,
        isBack: false,
      },
    },
    // 会员生日  回访记录
    {
      path: '/memberMain/visitRecord',
      name: 'visitRecord',
      component: () => import('@/views/Member/visitRecord'),
      meta: {
        title: '回访记录',
      },
    },
    // 会员首页
    {
      path: '/memberMain',
      name: 'memberMain',
      component: () => import('@/views/Member/memberMain/index.vue'),
      meta: {
        title: '会员首页',
        keepAlive: true,
        isBack: false,
      },
    },
    // 我的会员
    {
      path: '/memberMain/myMember',
      name: 'myMember',
      component: () => import('@/views/Member/myMember/index.vue'),
      meta: {
        title: '会员首页-我的会员',
        keepAlive: true,
        isBack: false,
      },
    },
    // 会员详情
    {
      path: '/memberMain/memberDetail',
      name: 'memberDetail',
      component: () => import('@/views/Member/memberDetail/index.vue'),
      meta: {
        title: '会员详情',
        keepAlive: true,
        isBack: false,
      },
    },
    // 会员查询
    {
      path: '/workMain/memberSearch',
      name: 'memberSearch',
      component: () => import('@/views/Member/memberSearch/index.vue'),
      meta: {
        title: '会员查询',
        // keepAlive: true,
        // isBack: false,
      },
    },
    // 消费明细
    {
      path: '/memberMain/consumeDetail',
      name: 'consumeDetail',
      component: () => import('@/views/Member/consumeDetail'),
      meta: {
        title: '消费明细',
        // keepAlive: true,
        // isBack: false,
      },
    },

    // 工作台首页
    {
      path: '/workMain',
      name: 'workMain',
      component: () => import('@/views/Work/workMain/index.vue'),
      meta: {
        title: '工作台',
        keepAlive: true,
        isBack: false,
      },
    },
    // 业绩指标
    {
      path: '/workMain/performanceIndicator',
      name: 'performanceIndicator',
      component: () => import('@/views/Work/performance/performanceIndicator/index.vue'),
      meta: {
        title: '业绩指标',
        keepAlive: true,
        isBack: false,
      },
    },
    // 会员招募指标
    {
      path: '/workMain/recruitIndicator',
      name: 'recruitIndicator',
      component: () => import('@/views/Work/recruit/recruitIndicator/index.vue'),
      meta: {
        title: '会员招募指标',
        keepAlive: true,
        isBack: false,
      },
    },
    // 储值卡指标
    {
      path: '/workMain/valueIndicator',
      name: 'valueIndicator',
      component: () => import('@/views/Work/valueCard/valueCardIndicator/index.vue'),
      meta: {
        title: '储值卡指标',
        keepAlive: true,
        isBack: false,
      },
    },

    // 业绩指标新增
    {
      path: '/workMain/performanceAdd',
      name: 'performanceAdd',
      component: () => import('@/views/Work/performance/performanceAdd/index.vue'),
      meta: {
        title: '业绩指标',
      },
    },
    // 储值卡指标新增
    {
      path: '/workMain/valueCardAdd',
      name: 'valueCardAdd',
      component: () => import('@/views/Work/valueCard/valueCardAdd/index.vue'),
      meta: {
        title: '储值卡指标',
      },
    },
    // 招募指标新增
    {
      path: '/workMain/recruitAdd',
      name: 'recruitAdd',
      component: () => import('@/views/Work/recruit/recruitAdd/index.vue'),
      meta: {
        title: '会员招募指标',
      },
    },

    // 区域库存查询
    {
      path: '/workMain/areaInventorySearch',
      name: 'areaInventorySearch',
      component: () => import('@/views/Work/areaInventorySearch/index.vue'),
      meta: {
        title: '区域库存查询',
        keepAlive: true,
        // isBack: false,
      },
    },
    // 商品查询
    {
      path: '/workMain/goodSearch',
      name: 'goodSearch',
      component: () => import('@/views/Work/goodSearch/index.vue'),
      meta: {
        title: '商品查询',
        keepAlive: true,
        // isBack: false,
      },
    },
    // 商品查询详细
    {
      path: '/workMain/goodsDetail',
      name: 'goodsDetail',
      component: () => import('@/views/Work/goodsDetail/index.vue'),
      meta: {
        title: '详情',
        // keepAlive: true,
        // isBack: false,
      },
    },
    // 店铺查询
    {
      path: '/workMain/storeSearch',
      name: 'storeSearch',
      component: () => import('@/views/Work/storeSearch/index.vue'),
      meta: {
        title: '店铺查询',
        keepAlive: true,
      },
    },
    // 报表
    {
      path: '/workMain/table',
      name: 'table',
      component: () => import('@/views/Work/table'),

    },

    // 我的任务业绩
    {
      path: '/workMain/myPerformanceIndicator',
      name: 'myPerformanceIndicator',
      component: () => import('@/views/Work/myTask/performance/performanceIndicator/index.vue'),
      meta: {
        title: '我的业绩指标',
        keepAlive: true,
        isBack: false,
      },
    },
    // 我的任务业绩 详情
    {
      path: '/workMain/myPerformanceDetail',
      name: 'myPerformanceDetail',
      component: () => import('@/views/Work/myTask/performance/performanceDetail/index.vue'),
      meta: {
        title: '我的业绩指标',
      },
    },
    // 我的会员指标
    {
      path: '/workMain/myRecruitIndicator',
      name: 'myRecruitIndicator',
      component: () => import('@/views/Work/myTask/recruit/recruitIndicator/index.vue'),
      meta: {
        title: '我的招募指标',
        keepAlive: true,
        isBack: false,
      },
    },
    // 我的任务会员招募 详情
    {
      path: '/workMain/myRecruitDetail',
      name: 'myRecruitDetail',
      component: () => import('@/views/Work/myTask/recruit/recruitDetail/index.vue'),
      meta: {
        title: '我的招募指标',
      },
    },
    // 我的储值卡指标
    {
      path: '/workMain/myValueCardIndicator',
      name: 'myValueCardIndicator',
      component: () => import('@/views/Work/myTask/valueCard/valueCardIndicator/index.vue'),
      meta: {
        title: '我的招募指标',
        keepAlive: true,
        isBack: false,
      },
    },
    // 我的任务储值卡 详情
    {
      path: '/workMain/myValueCardDetail',
      name: 'myValueCardDetail',
      component: () => import('@/views/Work/myTask/valueCard/valueCardDetail/index.vue'),
      meta: {
        title: '我的招募指标',
      },
    },
    // 优惠券发券
    {
      path: '/workMain/couponList',
      name: 'couponList',
      component: () => import('@/views/Work/coupon/couponList/index.vue'),
      meta: {
        title: '优惠券列表',
        // keepAlive: true,
        // isBack: false,
      },
    },
    {
      path: '/workMain/couponDetail',
      name: 'couponDetail',
      component: () => import('@/views/Work/coupon/couponDetail/index.vue'),
      meta: {
        title: '优惠券详情',
        keepAlive: true,
        isBack: false,
      },
    },
    {
      path: '/workMain/couponInfo',
      name: 'couponInfo',
      component: () => import('@/views/Work/coupon/couponInfo/index.vue'),
      meta: {
        title: '优惠券明细查询',
      },
    },
    {
      path: '/workMain/screenMember',
      name: 'screenMember',
      component: () => import('@/views/Work/coupon/screenMember/index.vue'),
      meta: {
        title: '选择会员',

      },
    },
    {
      path: '/workMain/codeDetail',
      name: 'codeDetail',
      component: () => import('@/views/Work/coupon/codeDetail/index.vue'),
      meta: {
        title: '优惠券详情',
      },
    },
    {
      path: '/workMain/registration',
      name: 'registration',
      component: () => import('@/views/Work/registration/index.vue'),
      meta: {
        title: '会员注册',
      },
    },
    // 会员招募
    {
      path: '/Supervisor/vipConsumption',
      name: 'vipConsumption',
      component: () => import('@/views/vipConsumption/index.vue'),
      meta: {
        title: '会员招募',
        keepAlive: true,
        isBack: false,
      },
    },
    // 本期招募人数
    {
      path: '/Supervisor/currentVipConsumption',
      name: 'currentVipConsumption',
      component: () => import('@/views/vipConsumption/currentVipConsumption/index.vue'),
      meta: {
        title: '本期招募人数',
      },
    },

    // 会员生日
    {
      path: '/Supervisor/vipBirthday',
      name: 'vipBirthday',
      component: () => import('@/views/vipBirthday/index.vue'),
      meta: {
        title: '会员生日',
        keepAlive: true,
        isBack: false,
      },
    },
    // 会员服务
    {
      path: '/Supervisor/vipServices',
      name: 'vipServices',
      component: () => import('@/views/vipServices/index.vue'),
      meta: {
        title: '会员服务',
        keepAlive: true,
        isBack: false,
      },
    },
    // 会员服务--详情
    {
      path: '/Supervisor/vipServices/vipServicesDetail',
      name: 'vipServicesDetail',
      component: () => import('@/views/vipServices/vipServicesDetail/index.vue'),
      meta: {
        title: '会员服务-详情',
        keepAlive: true,
        isBack: false,
      },
    },
    // 会员分析--会员消费
    {
      path: '/Supervisor/vipConsume',
      name: 'vipConsume',
      component: () => import('@/views/vipConsume/index'),
      meta: {
        title: '会员消费',
        keepAlive: true,
        isBack: false,
      },
    },
    // 会员分析--会员消费--店员业绩
    {
      path: '/Supervisor/empSales',
      name: 'empSales',
      component: () => import('@/views/vipConsume/empSales/index'),
      meta: {
        title: '店员业绩',
      },
    },
    // 会员分析--会员标签维护
    {
      path: '/Supervisor/vipLabelMaintain',
      name: 'vipLabelMaintain',
      component: () => import('@/views/vipLabelMaintain/index'),
      meta: {
        title: '会员标签维护',
        keepAlive: true,
        isBack: false,
      },
    },
    // 会员分析--会员标签维护详情
    {
      path: '/Supervisor/vipLabelMaintainDetail',
      name: 'vipLabelMaintainDetail',
      component: () => import('@/views/vipLabelMaintain/vipLabelMaintainDetail/index'),
      meta: {
        title: '会员标签维护详情',
        keepAlive: true,
        isBack: false,
      },
    },

    // 零售分析--总业绩分析
    {
      path: '/Supervisor/totalPerformance',
      name: 'totalPerformance',
      component: () => import('@/views/retailAnalyze/totalPerformance/index'),
      meta: {
        title: '总业绩分析',
        keepAlive: true,
        isBack: false,
      },
    },

    // 零售分析--总业绩分析详情
    {
      path: '/Supervisor/totalPerformanceDetail',
      name: 'totalPerformanceDetail',
      component: () => import('@/views/retailAnalyze/totalPerformanceDetail/index'),
      meta: {
        title: '总业绩分析详情',
      },
    },
    // 零售分析 --店员分析
    {
      path: '/Supervisor/clerkAnalyze',
      name: 'clerkAnalyze',
      component: () => import('@/views/retailAnalyze/clerkAnalyze/index'),
      meta: {
        title: '店员分析',
        keepAlive: true,
        isBack: false,
      },
    },
    // 零售分析 --店员详细分析
    {
      path: '/Supervisor/clerkAnalyzeDetail',
      name: 'clerkAnalyzeDetail',
      component: () => import('@/views/retailAnalyze/clerkAnalyzeDetail/index'),
      meta: {
        title: '店员详细分析',
      },
    },
    // 商品分析--畅销款排名
    {
      path: '/Supervisor/bestsellerRank',
      name: 'bestsellerRank',
      component: () => import('@/views/goodsAnalyze/bestsellerRank/index.vue'),
      meta: {
        title: '畅销款排名',
      },
    },
    // 商品分析--库存分析
    {
      path: '/Supervisor/areaInventoryAnalyze',
      name: 'areaInventoryAnalyze',
      component: () => import('@/views/goodsAnalyze/areaInventoryAnalyze/index.vue'),
      meta: {
        title: '库存分析',
        keepAlive: true,
        isBack: false,
      },
    },
    // 商品分析--库存分析明细
    {
      path: '/Supervisor/areaInventoryAnalyzeDetail',
      name: 'areaInventoryAnalyzeDetail',
      component: () => import('@/views/goodsAnalyze/areaInventoryAnalyzeDetail/index.vue'),
      meta: {
        title: '库存分析明细',
      },
    },
    // 变更专属导购
    {
      path: '/exchange',
      name: 'exchange',
      component: () => import('@/views/exchange/index'),
      meta: {
        title: '变更专属导购',
      },
    },

    // 无权限
    {
      path: '/userNotFound',
      name: 'userNotFound',
      component: () => import('@/views/userNotFound'),

    },
    // 不是在企业微信中打开的错误提示
    {
      path: '/error',
      name: 'error',
      component: () => import('@/views/error'),
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/test.vue'),
    },
  ],
});

export default router;
