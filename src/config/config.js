export default {
  Server: 'http://localhost:8080/',
  // Server:'http://www.shop178.net/peanutvr/',
  api: {
    oauth: {
      login: 'api/oauth/user/login',
      refresh: 'api/oauth/user/refresh',
      permission: 'api/oauth/user/permission'
    },
    user: {
      query: 'api/user/query',
      create:'api/user/create',
      update:'api/user/update',
      detail:'api/user/detail'
    },
    role: {
      query: 'api/role/query',
      create:'api/role/create',
      update:'api/role/update',
      detail:'api/role/detail'
    },
    package: {
      query: 'api/package/query'
    },
    whitelist: {
      create: 'api/whitelist/create',
      attrQuery: 'api/whitelist/attr/query',

      query: "api/whitelist/query",
      update: "api/whitelist/update",
      remove: "api/whitelist/remove"

    },
    order: {
      query: 'api/order/query'
    },
    queryLog: 'api/system/log/query'
  },

  Message:{
    NETWORK_INVALID:'请求失败，请检查网络情况',
    INVALID_TOKEN:'授权登录令牌无效',
    EXPIRED_TOKEN:'授权登录令牌已过期',
    INSUFFICIENT_SCOPE:'当前授权操作范围无效',
    INVALID_CLIENT:'客户端无效',
    UNAUTHORIZED_CLIENT:'客户端未授权',
    INVALID_USER:'用户名或密码无效',
    INVALID_REFRESH_TOKEN:'刷新令牌无效',
    EXPIRED_REFRESH_TOKEN:'刷新令牌已过期',
    ERROR_PWD_OLD:'原密码输入错误',
    CAN_NOT_LOGIN:'用户账号已被禁用',
    USER_LOCK:'该帐号已被锁定，请等待自动解锁',
    USER_ADMIN_RESETPWD:'该帐号为管理员,不可重置密码',
    GROUP_ADMIN_PERMISSION:'该角色为系统默认角色,不可修改权限',
    USER_TIME_60:'请及时修改密码，否则过期后不可使用',
    USER_TIME_90:'无法登录使用，需要超级管理员协助重置密码使用',
    MOBILE_LOCK:'该手机已被锁定，请等待自动解锁',
    MOBILE_LOCK_20:'该终端锁定1小时',
  }
}