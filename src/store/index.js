import Vue from 'vue'
import Vuex from 'vuex'
import appStore from './appStore'
import userStore from './userStore'


Vue.use(Vuex)

const modules = {
  appStore,
  userStore
}
export const mainModules = modules;

export const store = new Vuex.Store({
  modules
})
// export default new Vuex.Store({
//   state: {
//     currentUser: {}
//   },
//   mutations: {
//     saveCurrent(state, payload) {
//       state.currentUser = payload;
//     }
//   },
//   actions: {
//     login(data) {
//       debugger;
//       this.commit('saveCurrent', data);
//     }
//   },
//   modules: {}
// })