import { otherRouter, appRouter } from '@/modules/router/router';
import Util from '../../Util/index';
import Vue from 'vue';

const app = {
  state: {
    cachePage: [],
    isFullScreen: false,
    openedSubmenuArr: [], // 要展开的菜单数组
    menuTheme: 'dark', // 主题
    themeColor: '',
    pageOpenedList: [{ title: '首页', path: '', name: 'home_index' }],
    currentPageName: '',
    currentPath: [{ title: '首页', path: '', name: 'home_index' }], // 面包屑数组
    menuList: [],
    routers: [otherRouter, ...appRouter],
    tagsList: [...otherRouter.children],
    messageCount: 0,
    dontCache: [] // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
  },
  mutations: {
    setTagsList(state, list) {
      state.tagsList.push(...list);
    },
    // 更新菜单列表
    updateMenulist(state) {
      console.debug(`debug - 更新菜单`);
      let permissions = [];
      if (localStorage.permission) {
        permissions = JSON.parse(localStorage.permission);
      }
      let menuList = [];
      const _find_children = (item) => {
        return item.children.filter(child => {
          if (child.display === undefined || child.display === true) {
            // 判断模块是否拥有功能权限设置，如果没有则可以直接访问；如果有则需要进行权限校验
            if (child.permission === undefined && child.meta && child.meta.powers) {
              let hasPermission = false;
              let powers = [];
              child.meta.powers.forEach(power => {
                if(permissions.indexOf(`${child.name}-${power.code}`)>-1){
                  powers.push(power);
                }
              });
              if( powers.length > 0){
                child.meta.powers = powers;
                return child;
              }
              // child.meta.powers.forEach(power => {
              //   power.enable = permissions.indexOf(`${child.name}-${power.code}`) > -1
              // });
              // if (child.meta.powers.find(power => { return power && power.enable; })) {
              //   return child
              // }
            } else {
              return child;
            }
          }
        });
      }

      appRouter.forEach((item, index) => {
        //不需要权限控制
        if (permissions.length === 0) {
          menuList.push(item);
        } else {
          if (permissions.indexOf(item.name) > -1) {
            if (item.children.length === 1) {
              menuList.push(item);
            } else {
              let len = menuList.push(item);
              menuList[len - 1].children = _find_children(item);
            }
          } else if (item.children.length > 0) {
            let childrenArr = _find_children(item);
            if (childrenArr.length > 0) {
              item.children = childrenArr;
              menuList.push(item);
            }
          }
        }

      });

      state.menuList = menuList;
    },

    changeMenuTheme(state, theme) {
      state.menuTheme = theme;
    },

    changeMainTheme(state, mainTheme) {
      state.themeColor = mainTheme;
    },

    addOpenSubmenu(state, name) {
      let hasThisName = false;
      let isEmpty = false;
      if (name.length === 0) {
        isEmpty = true;
      }
      if (state.openedSubmenuArr.indexOf(name) > -1) {
        hasThisName = true;
      }
      if (!hasThisName && !isEmpty) {
        state.openedSubmenuArr.push(name);
      }
    },

    pageOpenedList(state, get) {
      let openedPage = state.pageOpenedList[get.index];
      if (get.argu) {
        openedPage.argu = get.argu;
      }
      if (get.query) {
        openedPage.query = get.query;
      }
      state.pageOpenedList.splice(get.index, 1, openedPage);
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },

    /**
     * 关闭全部页面
     * @param {object} state 状态管理器
     */
    clearAllTags(state) {
      state.pageOpenedList.splice(1);
      state.cachePage.length = 0;
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },

    /**
     * 关闭其他页面
     * @param {object} state 状态管理器
     * @param {object} vm Vue对象
     */
    clearOtherTags(state, vm) {
      let currentName = vm.$route.name;
      let currentIndex = 0;
      state.pageOpenedList.forEach((item, index) => {
        if (item.name === currentName) {
          currentIndex = index;
        }
      });
      if (currentIndex === 0) {
        state.pageOpenedList.splice(1);
      } else {
        state.pageOpenedList.splice(currentIndex + 1);
        state.pageOpenedList.splice(1, currentIndex - 1);
      }
      let newCachepage = state.cachePage.filter(item => {
        return item === currentName;
      });
      state.cachePage = newCachepage;
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },

    setOpenedList(state) {
      state.pageOpenedList = localStorage.pageOpenedList 
        ? JSON.parse(localStorage.pageOpenedList)
        : [otherRouter.children[0]];

      if (localStorage.cachePage) {
        state.cachePage = JSON.parse(localStorage.cachePage);
      } else {
        state.cachePage.length = 0;
      }
    },

    setCurrentPath(state, pathArr) {
      state.currentPath = pathArr;
    },
    
    setCurrentPageName(state, name) {
      state.currentPageName = name;
    },

    clearOpenedSubmenu(state) {
      state.openedSubmenuArr.length = 0;
    },

    setMessageCount(state, count) {
      state.messageCount = count;
    },

    increateTag(state, tagObj) {
      if (!Util.oneOf(tagObj.name, state.dontCache)) {
        state.cachePage.push(tagObj.name);
        localStorage.cachePage = JSON.stringify(state.cachePage);
      }
      state.pageOpenedList.push({name:tagObj.name, path:tagObj.path, title:tagObj.title});
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    }
  },
  actions:{
    init:function(context){
      console.debug(`debug - 初始化 APP store`);
    }
  }
};

export default app;
