import Vue from 'vue';
import Router from 'vue-router';
import iView from 'iview';
import Layout from '@/views/Layout';
import Login from '@/views/Login';
import Users from '@/views/users';
import UserList from '@/views/users/list';
import Settings from '@/views/settings';
import SettingCommon from '@/views/settings/common';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/users',
      children: [
        {
          path: 'users',
          component: Users,
          meta: { title: '用户管理', icon: 'person-stalker' },
          children: [
            {
              path: '/users',
              component: UserList,
              meta: { title: '用户列表', hidden: false },
            },
          ],
        },
        {
          path: 'settings',
          component: Settings,
          redirect: '/settings/common',
          meta: { title: '系统设置', icon: 'android-settings' },
          children: [
            {
              path: '/settings/common',
              component: SettingCommon,
              meta: { title: '公共设置' },
            },
          ],
        },
      ],
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '*',
      component: Layout,
    },
  ],
});

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();

  if (sessionStorage.token && to.path === '/login') {
    sessionStorage.removeItem('token');
    iView.Message.warning('注销成功');
    return next();
  }
  if (sessionStorage.token || to.path === '/login') return next();
  return next({
    path: '/login',
    query: { redirect: to.fullPath },
  });
});

router.afterEach(() => {
  iView.LoadingBar.finish();
});

export default router;
