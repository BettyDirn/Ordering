// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/index'
import VueResource from 'vue-resource'

import './common/stylus/index.styl'
/* 注册 */
Vue.use(VueRouter)
Vue.use(VueResource)

const router = new VueRouter({
  routes,
  linkActiveClass: 'active'
})

/* eslint-disable no-new */
new Vue({
  router
}).$mount('#app')
//router.push('/goods')
