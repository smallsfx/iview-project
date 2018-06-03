import Vue from 'vue';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import { router } from './modules/router/index';
import { appRouter } from './modules/router/router';
import store from './modules/store';
import App from './views/App/App.vue';
import '@/modules/locale';
import VueI18n from 'vue-i18n';
import Axios from './modules/ajax/index';
import './modules/permission/index';

import Config from '@/config/config';

console.info(JSON.stringify(Config));

Vue.use(VueI18n);
Vue.use(iView);
Vue.config.errorHandler = (error, vm) => {
    console.group(`抛出全局异常`);
    console.error(vm);
    console.error(error);
    console.groupEnd(`抛出全局异常`);
};
Vue.prototype.$throw = (error) => errorHandler(error, this);

const VueApp = new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted() {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
        // iview-admin检查更新
        // util.checkUpdate(this);
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
