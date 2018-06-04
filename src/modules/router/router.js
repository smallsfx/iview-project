import Main from '@/views/Main/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = { path: '/login', name: 'login', meta: { title: 'Login - 登录' }, component: () => import('@/views/Login/login.vue') };

export const page404 = {path: '/*',name: 'error-404',meta: {title: '404-页面不存在'},component: () => import('@/views/error-page/404.vue')};

export const page403 = {path: '/403',meta: {title: '403-权限不足'},name: 'error-403',component: () => import('@//views/error-page/403.vue')};

export const page500 = {path: '/500',meta: {title: '500-服务端错误'},name: 'error-500',component: () => import('@/views/error-page/500.vue')};

export const locking = {path: '/locking',name: 'locking',component: () => import('@/views/Main/components/lockscreen/components/locking-page.vue')};

const _routeGenerator = (path, icon, name, title, component, children, powers) => {
  let router = {
    path: path,
    icon: icon,
    name: name,
    title: title,
    component: component || Main,
    meta: {}
  };
  if (children) {
    router.children = children;
  }
  if (powers) {
    router.meta.powers = powers;
  }
  return router;
}

const _moduleRouteGenerator = (path, name, title, component, powers) => {
  return _routeGenerator(path, undefined, name, title, component, undefined, powers);
};

const CONST_POWER = {
  BROWSER: { text: '访问', code: 'browser' },
  SEARCH: { text: '查询', code: 'search' },
  CREATE: { text: '新增', code: 'create' },
  UPDATE: { text: '编辑', code: 'update' },
  REMOVE: { text: '删除', code: 'remove' },
  ENABLE: { text: '启用', code: 'enable' },
  DISABLE: { text: '禁用', code: 'disable' },
  EXPORT: { text: '导出', code: 'export' }
}

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  component: Main,
  children: [
    { path: 'home', title: '首页', name: 'home_index', component: () => import('@/views/home/home.vue') },
    { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue') },
    { path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue') },

    _moduleRouteGenerator('create/package', 'package-create', '新增套餐', () => import('@/views/Package/edit.vue')),
    _moduleRouteGenerator('update/package/:id', 'package-update', '编辑套餐', () => import('@/views/Package/edit.vue')),

    _moduleRouteGenerator('create/whitelist', 'whitelist-create', '新增白名单', () => import('@/views/Customer/Whitelist/edit.vue')),
    _moduleRouteGenerator('update/whitelist/:id', 'whitelist-update', '编辑白名单', () => import('@/views/Customer/Whitelist/edit.vue')),

    _moduleRouteGenerator('create/user', 'user-create', '创建用户', () => import('@/views/System/User/edit.vue')),
    _moduleRouteGenerator('update/user/:id', 'user-update', '编辑用户', () => import('@/views/System/User/edit.vue')),

    _moduleRouteGenerator('create/role', 'role-create', '创建角色', () => import('@/views/System/Role/edit.vue')),
    _moduleRouteGenerator('update/role/:id', 'role-update', '编辑角色', () => import('@/views/System/Role/edit.vue')),
  ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/order', icon: 'key', name: 'order', title: '订单管理', component: Main,
    children: [
      _moduleRouteGenerator('search', 'order-search', '订单查询', () => import('@/views/Order/Search/index.vue'), [CONST_POWER.BROWSER, CONST_POWER.SEARCH])
    ]
  },
  {
    path: '/package', icon: 'key', name: 'package', title: '套餐管理', component: Main,
    children: [
      _moduleRouteGenerator('search', 'package-search', '套餐查询', () => import('@/views/Package/index.vue'), [CONST_POWER.BROWSER, CONST_POWER.SEARCH, CONST_POWER.CREATE, CONST_POWER.UPDATE, CONST_POWER.REMOVE, CONST_POWER.ENABLE, CONST_POWER.DISABLE])
    ]
  },
  {
    path: '/customer', icon: 'ios-people', name: 'customer', title: '客户管理', component: Main,
    children: [
      _moduleRouteGenerator('search', 'whitelist-search', '白名单管理', () => import('@/views/Customer/Whitelist/index.vue'), [CONST_POWER.BROWSER, CONST_POWER.SEARCH, CONST_POWER.CREATE, CONST_POWER.UPDATE, CONST_POWER.REMOVE, CONST_POWER.ENABLE, CONST_POWER.DISABLE]),
    ]
  },
  {
    path: '/system', icon: 'key', name: 'system', title: '系统管理', component: Main,
    children: [
      _moduleRouteGenerator('user', 'user-manage', '用户管理', () => import('@/views/System/User/index.vue'), [CONST_POWER.BROWSER, CONST_POWER.SEARCH, CONST_POWER.CREATE, CONST_POWER.UPDATE, CONST_POWER.REMOVE, CONST_POWER.ENABLE, CONST_POWER.DISABLE]),
      _moduleRouteGenerator('role', 'role-manage', '角色管理', () => import('@/views/System/Role/index.vue'), [CONST_POWER.BROWSER, CONST_POWER.SEARCH, CONST_POWER.CREATE, CONST_POWER.UPDATE, CONST_POWER.REMOVE, CONST_POWER.ENABLE, CONST_POWER.DISABLE]),
      _moduleRouteGenerator('log', 'logger-manage', '日志查询', () => import('@/views/System/Log/index.vue'), [CONST_POWER.BROWSER, CONST_POWER.SEARCH, CONST_POWER.REMOVE, CONST_POWER.EXPORT]),
    ]
  }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  otherRouter,
  locking,
  ...appRouter,
  page500,
  page403,
  page404
];
