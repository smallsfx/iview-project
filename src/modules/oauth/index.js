
let OAuthModule = function () {

}

OAuthModule.prototype = {
  record: (method, url, args, resolve, reject) => {
    if (url.indexOf('/user/refresh') === -1) {
      this.lastRequest = {
        method: 'get',
        option: option,
        url: url,
        resolve: resolve,
        reject: reject
      };
    }
  },
  redo: () => {

  }
}

export let oauth = new OAuthModule();