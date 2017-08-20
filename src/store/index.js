import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: {},
    settings: {},
  },
  mutations: {
    /* eslint no-param-reassign: ["error", { "props": false }] */
    USER(state, user) {
      state.user = user;
    },
    SETTINGS(state, settings) {
      state.settings = settings;
    },
  },
  actions: {},
  getters: {},
});

export default store;
