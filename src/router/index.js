import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import {useAuthStore} from '../stores/auth'
import { useQuasar } from 'quasar'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(async (to, from, next) => {
    const $q = useQuasar()
    const user = await useAuthStore().getCurrentUser();
    const requiresRole = to.matched.some(record => record.meta && record.meta.requiresRole);
    if (requiresRole) {
      const userRole = user && user.roles;
      const isAllowed = user && to.matched.some(record => record.meta.requiresRole && record.meta.requiresRole.some(role => userRole.includes(role)));

      if (!isAllowed && user) {
        $q.notify('Tu n\'as pas les droits pour accéder à cette page');
        next(from);
      }
      if (!isAllowed && !user) {
        $q.notify('Tu dois être connecté pour accéder à cette page');
        next('/login');
      } else {
        next();
      }
    } else {
      next();
    }
  });


  return Router

})
