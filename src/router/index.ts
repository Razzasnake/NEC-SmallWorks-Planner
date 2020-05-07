import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth from '@okta/okta-vue'

Vue.use(Auth, {
  issuer: process.env.VUE_APP_OKTA_ISSUER,
  clientId: process.env.VUE_APP_OKTA_CLIENT_ID,
  redirectUri: process.env.VUE_APP_BASE_URL + '/implicit/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true
})

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: () => import(/* webpackChunkName: "HomeView" */ '@/views/Home.vue')
  },
  {
    path: '/test',
    name: 'TestView',
    component: () => import(/* webpackChunkName: "TestView" */ '@/views/Test.vue'),
    meta: {
      requiresAuth: true
    }
  },
  { path: '/implicit/callback', component: Auth.handleCallback() }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, _, next) => {
  /**
   * If the user is not logged in and they try to navigate to a protected
   * route, redirect them to the home page.
   */
  if (to.meta.requiresAuth) {
    if (await Vue.prototype.$auth.isAuthenticated()) {
      return next()
    }
    return next({ name: 'HomeView' })
  }
  return next()
})

export default router
