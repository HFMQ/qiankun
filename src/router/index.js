import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '**',
    name: '',
    component: () => import( /* webpackChunkName: "about" */ '../views/exception.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  // mode: 'history',
  // base: process.env.BASE_URL,   hash模式下 不生效
  // base: '/fdev/',
  routes
})

export default router