const user = {
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
        logout (state, vm) {
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
            // localStorage.userInfo = JSON.stringify(state.userInfo);
            localStorage.token = state.security.accessToken;
            localStorage.security = JSON.stringify(state.security);
        },

        setUserInfo (state ,data){
            state.permission = data.permissions;
            state.info = {
                nickName : data.nickName,
                roleName : data.roleName,
                mobile : data.mobile
            };
            // localStorage.userInfo = JSON.stringify(state.userInfo);
            localStorage.permission = JSON.stringify(state.permission);
        }

    }
};

export default user;