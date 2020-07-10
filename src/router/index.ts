import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackPreload: true */ '@/views/Home.vue')
  },
  {
    path: '/explore',
    name: 'Explore',
    component: () => import('@/views/Explore.vue')
  },
  {
    path: '/examples',
    name: 'Examples',
    component: () => import('@/views/Examples.vue')
  },
  {
    path: '/features',
    name: 'Features',
    component: () => import('@/views/Features.vue')
  },
  { path: '/*', redirect: '/' }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, _, next) => {
  if (to.name && to.name !== 'Home') {
    document.title = to.name + ' | Table & Map';
  } else {
    document.title = 'Table & Map'
  }
  next();
});

export default router
