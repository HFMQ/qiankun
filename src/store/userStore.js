import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    currentUser: {
      password: '',
      username: ''
    }
  },
  getters: {

  },
  mutations: {
    saveCurrent(state, payload) {
      console.log('hf', payload);
      state.currentUser = payload;
    }
  },
  actions: {
    login({
      commit
    }, data) {
      commit('saveCurrent', data);
    }
  }
}