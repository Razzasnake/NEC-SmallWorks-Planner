import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import(/* webpackChunkName: "Account" */ '@/views/Account.vue')
  },
  {
    path: '/examples',
    name: 'Examples',
    component: () => import(/* webpackChunkName: "Examples" */ '@/views/Examples.vue')
  },
  {
    path: '/explore/:fileId?',
    name: 'Explore',
    component: () => import(/* webpackChunkName: "Explore" */ '@/views/Explore.vue'),
    props: true
  },
  {
    path: '/embed/:fileId?',
    name: 'Embed',
    component: () => import(/* webpackChunkName: "Embed" */ '@/views/Explore.vue'),
    props: true
  },
  {
    path: '/features/:slug',
    name: 'Feature',
    component: () => import(/* webpackChunkName: "Feature" */ '@/views/Feature.vue'),
    props: true
  },
  {
    path: '/features',
    name: 'Features',
    component: () => import(/* webpackChunkName: "Features" */ '@/views/Features.vue')
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: () => import(/* webpackChunkName: "Pricing" */ '@/views/Pricing.vue')
  },

  {
    path: '/uploads',
    name: 'Uploads',
    component: () => import(/* webpackChunkName: "Uploads" */ '@/views/Uploads.vue')
  },
  {
    path: '/*',
    name: '404',
    component: () => import(/* webpackChunkName: "Error404" */ '@/views/Error404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

export default router
