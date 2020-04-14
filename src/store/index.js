import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const state = {
  // 如果sessionStorage 中存在则使用sessionStorage 中数据  否则创建一个空 user   解决页面刷新丢失数据
  state: window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')) : {
    userInfo: '',
  },
  userName: '',
  allowBack: '',
};

const mutations = {
  SET_BACK: (state, allowBack) => {
    state.allowBack = allowBack;
  },

  SET_STORELIST: (state, targetStoreList) => {
    state.targetStoreList = targetStoreList;
  },
};

const actions = {
  updateAppSetting({ commit, state }, allowBack) {
    return new Promise((resolve, reject) => {
      commit('SET_BACK', allowBack);
    });
  },

};

const getters = {
  // 计算合计值
  // getAccount(state){
  //
  // },
};

const store = new Vuex.Store({
  state,
  mutations,
  actions,
});

export default store;
