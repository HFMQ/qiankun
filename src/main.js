import Vue from 'vue';
import App from './App.vue';
import router from './router';
import {
  store,
  mainModules
} from './store';
import {
  registerMicroApps,
  start,
  initGlobalState
} from 'qiankun';

// 组件
import components from '@/utils/component'

registerMicroApps([{
    name: 'microFapp', // app name registered
    entry: '//localhost:7100/main.js',
    container: '#fdevapp',
    props: {
      mainModules,
      getMainStoreModules: () => mainModules,
      components
    },
    activeRule: '#/microFapp',
    // activeRule: location => location.hash.split('/')[1] === 'microFapp',
  },
  {
    name: 'microFrqr',
    entry: '//localhost:7200/main.js',
    container: '#fdevrqr',
    props: {
      mainModules
    },
    activeRule: '#/microFrqr',
    // activeRule: location => location.hash.split('/')[1] === 'microFrqr',
  },
]);
let currentUserStr = JSON.stringify(store.currentUser);
// 可以通过 initGlobalState 生成全局参数
const actions = initGlobalState({
  store: currentUserStr,
});
// const actions = initGlobalState('hf');
actions.onGlobalStateChange((options, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log(options, prev);
});
actions.setGlobalState({
  store: 'store',
});
actions.offGlobalStateChange();
Vue.config.productionTip = false;
start();

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');