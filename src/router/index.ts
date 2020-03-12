import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: () => import(/* webpackChunkName: "HomeView" */ '@/views/Home.vue')
  },
  {
    path: '/app',
    name: 'AppView',
    component: () => import(/* webpackChunkName: "AppView" */ '@/views/App.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
