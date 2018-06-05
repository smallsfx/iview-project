import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    //
    _router: undefined,
    _vue: undefined,
  },
  mutations: {
    //
  },
  actions: {
    /**
     * 初始化状态管理器
     * @param {object} context 状态管理器
     * @param {object} vue Vue实例对象
     */
    init: function (context, vue) {
      context.state._router = vue.$router;
      context.state._vue = vue;
    },
    /**
     * 用户注销
     * @param {object} context 状态管理器
     */
    logout: function (context) {
      console.debug(`debug - logout - 用户注销 -`);
      context.commit("logout");
      context.commit("clearOpenedSubmenu");
      context.state._router.push({ name: "login" });
    },
    /**
     * 打开新页面
     * @param {object} context 状态管理器
     * @param {string} name 新页面名称 [在router中定义]
     * @param {JSON} argu 打开新页面时附带的params
     * @param {JSON} query 打开新页面时附带的query
     */
    openNewPage: function (context, name, argu, query) {
      console.debug(`debug - openNewPage - ${name} - ${argu} - ${query}`);

      let openeds = [];
      if( localStorage.framework_pages ){
        openeds = JSON.parse (localStorage.framework_pages);
      } else {
        openeds = context.state.app.pages;
        localStorage.framework_pages = JSON.stringify(context.state.app.pages);
      }
      let pageCount = openeds.length;

      console.debug(`debug - pages - ${openeds} - ${pageCount}`);
      let i = 0;
      let tagHasOpened = false;
      while (i < pageCount) {
        if (name === openeds[i].name) { // 页面已经打开
          context.commit('orderPages', { index: i, argu: argu, query: query });
          tagHasOpened = true;
          break;
        }
        i++;
      }
      if (!tagHasOpened) {
        let tag = context.state.app.tagsList.filter((item) => {
          if (item.children) {
            return name === item.children[0].name;
          } else {
            return name === item.name;
          }
        });
        tag = tag[0];
        if (tag) {
          tag = tag.children ? tag.children[0] : tag;
          if (argu) {
            tag.argu = argu;
          }
          if (query) {
            tag.query = query;
          }
          context.commit('increateTag', tag);
        }
      }
      context.commit('setCurrentPageName', name);
      context.state._router.push({ name: name });
    },
    /**
     * 关闭一个页面
     * @param {object} context 状态管理器
     * @param {string} name 待关闭页面的名称 [在router中定义]，默认为当前页面
     */
    closePage: function (context, name) {
      if (name == undefined) {
        name = context.state._vue.$route.name;
      }
      // 移除标签
      context.state.app.pages.map((item, index) => {
        if (item.name === name) {
          context.state.app.pages.splice(index, 1);
        }
      });
      // 保存已经打开的页面列表
      localStorage.framework_pages = JSON.stringify(context.state.app.pages);
      let lastPageName = '';
      if (context.state.app.pages.length > 1) {
        lastPageName = context.state.app.pages[context.state.app.pages.length - 1].name;
      } else {
        lastPageName = context.state.app.pages[0].name;
      }

      context.state.app.caches.forEach((item, index) => {
        if (item === name) {
          context.state.app.caches.splice(index, 1);
        }
      });
      context.state._router.push({ name: lastPageName });
    }

  },
  modules: {
    app,
    user
  }
});

export default store;
