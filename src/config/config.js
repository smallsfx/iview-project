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
      query: 'api/user/query'
    },
    role: {
      query: 'api/role/query'
    },
    package: {
      query: 'api/package/query'
    },
    whitelist: {
      create: 'api/whitelist/create',
      attrQuery: 'api/whitelist/attr/query'
    },
    order: {
      query: 'api/order/query'
    },
    queryLog: 'api/system/log/query'
  }
}