<style lang="less">
@import "./main.less";
</style>
<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto', background:menuTheme === 'dark' ? '#495060' : '#fff'}">
      <scroll-bar ref="scrollBar">
        <shrinkable-menu :shrink="shrink" @on-change="handleSubmenuChange" :theme="menuTheme" :before-push="beforePush" :open-names="openedSubmenuArr" :menu-list="menuList">
          <div slot="top" class="logo-con">
            <img v-show="!shrink" src="../../images/logo.jpg" key="max-logo" />
            <img v-show="shrink" src="../../images/logo-min.jpg" key="min-logo" />
          </div>
        </shrinkable-menu>
      </scroll-bar>
    </div>
    <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
      <div class="main-header">
        <div class="navicon-con">
          <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
            <Icon type="navicon" size="32"></Icon>
          </Button>
        </div>
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
          </div>
        </div>
        <div class="header-avator-con">
          <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
          <lock-screen></lock-screen>
          <message-tip v-model="mesCount"></message-tip>
          <theme-switch></theme-switch>
        </div>
        <div class="header-user-con">
          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{ userName }}</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="ownSpace">个人中心</DropdownItem>
                  <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <!-- <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar> -->
            </Row>
          </div>
        </div>
      </div>
      <div class="tags-con">
        <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
      </div>
    </div>
    <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
      <div class="single-page">
        <keep-alive :include="cachePage">
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import shrinkableMenu from "./components/shrinkable-menu/shrinkable-menu.vue";
import tagsPageOpened from "./components/tags-page-opened.vue";
import breadcrumbNav from "./components/breadcrumb-nav.vue";
import fullScreen from "./components/fullscreen.vue";
import lockScreen from "./components/lockscreen/lockscreen.vue";
import messageTip from "./components/message-tip.vue";
import themeSwitch from "./components/theme-switch/theme-switch.vue";
import util from "@/modules/Util/index";
import scrollBar from "./components/scroll-bar/vue-scroller-bars";
import Config from "@/config/config";
export default {
  components: {
    shrinkableMenu,
    tagsPageOpened,
    breadcrumbNav,
    fullScreen,
    lockScreen,
    messageTip,
    themeSwitch,
    scrollBar
  },
  data() {
    return {
      shrink: false,
      userName: "",
      roleName: "",
      mobile: "",
      isFullScreen: false,
      openedSubmenuArr: this.$store.state.app.openedSubmenuArr
    };
  },
  computed: {
    menuList() {
      return this.$store.state.app.menuList;
    },
    pageTagsList() {
      return this.$store.state.app.pages; // 打开的页面的页面对象
    },
    currentPath() {
      return this.$store.state.app.currentPath; // 当前面包屑数组
    },
    cachePage() {
      return this.$store.state.app.cachePage;
    },
    menuTheme() {
      return this.$store.state.app.menuTheme;
    },
    mesCount() {
      return this.$store.state.app.messageCount;
    }
  },
  methods: {
    init() {
      // 请求当前登录用户的权限
      this.$root.$axios.post(Config.api.oauth.permission, {}, response => {
        if (!response) {
          return;
        }
        let data = response.data;
        this.userName = data.nickName;
        this.roleName = data.roleName;
        this.mobile = data.mobile;
        this.$store.commit("setUserInfo", data);
        let messageCount = 3;
        this.messageCount = messageCount.toString();
        this.checkTag(this.$route.name);
        this.$store.commit("setMessageCount", 3);

        let pathArr = util.setCurrentPath(this, this.$route.name);
        this.$store.commit("updateMenulist");
        if (pathArr.length >= 2) {
          this.$store.commit("addOpenSubmenu", pathArr[1].name);
        }
        // 显示打开的页面的列表
        this.$store.commit("setOpenedList");
      });
    },
    
    toggleClick() {
      this.shrink = !this.shrink;
    },

    handleClickUserDropdown(name) {
      if (name === "ownSpace") {
        this.$store.dispatch("openNewPage", "ownspace_index");
      } else if (name === "loginout") {
        this.$store.dispatch("logout");
      }
    },

    checkTag(name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true;
        }
      });
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        this.$store.dispatch( "openNewPage", name, this.$route.params, this.$route.query);
      }
    },

    handleSubmenuChange(val) {
      // console.log(val)
    },

    beforePush(name) {
      // if (name === 'accesstest_index') {
      //     return false;
      // } else {
      //     return true;
      // }
      return true;
    },

    fullscreenChange(isFullScreen) {
      // console.log(isFullScreen);
    },

    scrollBarResize() {
      if (this.$refs.scrollBar) {
        this.$refs.scrollBar.resize();
      }
    }

  },

  watch: {
    
    $route(to) {
      this.$store.commit("setCurrentPageName", to.name);
      let pathArr = util.setCurrentPath(this, to.name);
      if (pathArr.length > 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      this.checkTag(to.name);
      localStorage.currentPageName = to.name;
    },

    openedSubmenuArr() {
      setTimeout(() => {
        this.scrollBarResize();
      }, 300);
    }

  },

  mounted() {
    this.init();
    window.addEventListener("resize", this.scrollBarResize);
  },

  created() {
    //
  },

  dispatch() {
    window.removeEventListener("resize", this.scrollBarResize);
  }
};
</script>
