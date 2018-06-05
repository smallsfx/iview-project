import Vue from 'vue';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import { router } from './modules/router/index';
import { appRouter } from './modules/router/router';
import Store from './modules/store';
import App from './views/App/App.vue';
import Axios from './modules/ajax/index';
import './modules/permission/index';
import Package from  '../package.json';
import Config from '@/config/config';

console.debug(`debug - 应用程序启动`);
console.debug(`debug - ${Package.name} v${Package.version}`);
console.debug(`debug - ${Package.description}`);
console.debug(`debug - ${Package.author}`);

console.debug(`debug - ${JSON.stringify(Config.Server)}`);
Vue.use(iView);

Vue.config.errorHandler = (error, vm) => {
  console.group(`抛出全局异常`);
  // console.error(vm);
  console.error(error);
  console.groupEnd(`抛出全局异常`);
};
Vue.prototype.$throw = (error) => errorHandler(error, this);

const VueApp = new Vue({
  el: '#app',
  router: router,
  store: Store,
  render: h => h(App),
  data: {
    currentPageName: ''
  },
  mounted() {
    this.$store.dispatch('init',this);
    
    // console.debug(`debug - ${JSON.stringify(this.$root.$store.state.app)}`);
    console.debug(`debug - ${JSON.stringify(this.$root.$store.state.user)}`);
    this.currentPageName = this.$route.name;
  },
  created() {
    let tagsList = [];
    appRouter.map((item) => {
      if (item.children.length <= 1) {
        tagsList.push(item.children[0]);
      } else {
        tagsList.push(...item.children);
      }
    });
    this.$store.commit('setTagsList', tagsList);
  }
});
Axios.init(VueApp);
VueApp.$axios = Axios;
