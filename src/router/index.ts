import Vue from 'vue'
import VueRouter from 'vue-router'

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
    path: '/features/:slug',
    name: 'Feature',
    component: () => import(/* webpackChunkName: "Feature" */ '@/views/Feature.vue'),
    props: true
  },
  {
    path: '/*',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
  }
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
    document.title = 'Table & Map - View excel files in a map'
  }
  next();
});

export default router
