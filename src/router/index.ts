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
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */ '@/views/Home.vue')
  },
  {
    path: '/explore',
    name: 'Explore',
    component: () => import(/* webpackChunkName: "Explore" */ '@/views/Explore.vue')
  },
  {
    path: '/examples',
    name: 'Examples',
    component: () => import(/* webpackChunkName: "Examples" */ '@/views/Examples.vue')
  },
  {
    path: '/features',
    name: 'Features',
    component: () => import(/* webpackChunkName: "Features" */ '@/views/Features.vue')
  },
  {
    path: '/uploads',
    name: 'Uploads',
    component: () => import(/* webpackChunkName: "Uploads" */ '@/views/Uploads.vue'),
    meta: {
      requiresAuth: true
    }
  },
  { path: '/implicit/callback', component: Auth.handleCallback() },
  { path: '/*', redirect: '/' }
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
    return next({ name: 'Home' })
  }
  return next()
})

router.beforeEach((to, from, next) => {
  if (to.name && to.name !== 'Home') {
    document.title = to.name + ' | Table & Map';
  } else {
    document.title = 'Table & Map'
  }
  next();
});

export default router
