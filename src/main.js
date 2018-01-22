import Vue from 'vue';
import iView from 'iview';
import App from './App';
import store from './store';
import router from './router';
import './mock';
import './styles/index.less';

Vue.use(iView);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
