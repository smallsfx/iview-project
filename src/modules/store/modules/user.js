export default {
  state: {
      security:{},
      permission:[],
      info:{
          nickName :'',
          roleName : '',
          mobile :''
      }
  },
  mutations: {

    logout (state) {
      // 恢复默认样式
      let themeLink = document.querySelector('link[name="theme"]');
      themeLink.setAttribute('href', '');
      // 清空打开的页面等数据，但是保存主题数据
      let theme = '';
      if (localStorage.theme) {
        theme = localStorage.theme;
      }
      localStorage.clear();
      if (theme) {
        localStorage.theme = theme;
      }
    },

    setSecurity (state, data){
      state.security = data||{};
      localStorage.accessToken = state.security.accessToken;
      localStorage.refreshToken = state.security.refreshToken;
      localStorage.security = JSON.stringify(state.security);
    },

    setUserInfo (state ,data){
      state.info = {
        nickName : data.nickName,
        roleName : data.roleName,
        mobile : data.mobile
      };
      localStorage.nickName = data.nickName;
      localStorage.permission = JSON.stringify(data.permissions);
    }
    
  },
  getters:{
    security:function(state){
      return JSON.parse(localStorage.security);
    }
  },
  actions:{
    init:function(context){
      console.debug(`debug - 初始化 USER store`);
      if( localStorage.security){
        context.state.security = JSON.parse(localStorage.security);
      }
    }
  }
};
