import axios from 'axios';
import iView from 'iview';

import Config from '@/config/config';

// axios.install = (Vue) => {
//     Vue.prototype.$axios = axios
// }

export default {
  lastRequest : {},
  init :function (App) {
    let self = this;
    this.Vue = App;
    axios.defaults.timeout = 5000;
    axios.defaults.baseURL = Config.Server;

    axios.interceptors.request.use(
      config => {
        config.headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
        iView.LoadingBar.start();
        config.transformRequest = [function (data) {
          let ret = '';
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
          }
          return ret;
        }];
        // console.debug(`开始请求:[${config.method}] ${config.url}[${config.params?JSON.stringify(config.params):JSON.stringify(config.data)}]`);
        return config;
      },
      err => {
        // console.debug(`请求失败`);
        return Promise.reject(err);
      }
    );

    axios.interceptors.response.use(
      response => {
        // console.debug(`接收响应：${JSON.stringify(response.data)}`);
        // console.debug(`接收响应成功`);
        if (response.data && response.data.ret === 0) {
          iView.LoadingBar.finish();
          return response.data;
        } else if (response.data.ret === 10001) {
          App.$Message.info(Config.Message.INVALID_TOKEN);
          console.debug(`debug - ${Config.Message.INVALID_TOKEN}`);
          App.$store.dispatch('logout',App.$router);
        } else if (response.data.ret === 10002) {
          console.debug(`debug - ${Config.Message.EXPIRED_TOKEN}`);
          let args = {
            refresh_token : App.$store.getters.security.refreshToken
          };
          self.post(Config.api.oauth.refresh, args, function (response) {
            if (!response) { return; }
            let data = response.data;
            App.$store.commit('setSecurity', data);
            if (self.lastRequest) {
              self[self.lastRequest.method](
                self.lastRequest.url,
                self.lastRequest.option,
                self.lastRequest.resolve,
                self.lastRequest.reject)
            }
          });
        } else if(response.data.ret === 10004){
          App.$store.dispatch('logout',App.$router);
        } else {
          iView.LoadingBar.error();
          let text = `${response.data.msg}`;
          if (response.data.data) {
            for (var property in response.data.data) {
              text += '\r\n\t   ' + response.data.data[property];
            };
          }
          App.$Message.info(text);
        }
      },

      error => {
        console.debug(`响应异常：${JSON.stringify(error)}`)
        iView.LoadingBar.error();
        if (error.message === 'Network Error') {
          App.$Message.error(Config.Message.NETWORK_INVALID);
        } else if (error.message) {
          App.$Message.error(error.message);
        } else {
          App.$Message.error(error.response.data);
        }
      }
    );
  },

  _append_token : (args) => {
    let option = args || {};
    let token = localStorage.accessToken;
    if (token) {
      option.access_token = token;
    }
    return option;
  },

  get : function (url, args, resolve, reject) {
    let option = this._append_token(args);
    if (url.indexOf('/user/refresh') === -1) {
      this.lastRequest = {
        method: 'get',
        option: option,
        url: url,
        resolve: resolve,
        reject: reject
      }
    }
    axios.get(url, { params: option }).then(resolve).catch(reject);
  },

  post: function (url, args, resolve, reject) {
    let option = this._append_token(args);
    if (url.indexOf('/user/refresh') === -1) {
      this.lastRequest = {
        method: 'post',
        option: option,
        url: url,
        resolve: resolve,
        reject: reject
      }
    }
    axios.post(url, option).then(resolve).catch(reject);
  }
}