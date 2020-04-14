export default {
  // 不显示加载提示
  loading: ['auth/code', 'oauth/token', 'token/logout', 'external/getGuideInfo', 'external/guideChanges', 'user/info', 'role/menu'],

  // 不用添加店铺id
  nullStoreId: ['auth/code', 'oauth/token', 'token/logout', 'external/getGuideInfo', 'external/guideChanges', 'user/info', 'role/menu','taskSales/storeTask'],

  // 需要添加授权代码
  AuthorizationCode: ['auth/code', 'oauth/token'],
  // 不需要token
  nullToken: ['external/getGuideInfo', 'external/guideChanges'],
};
