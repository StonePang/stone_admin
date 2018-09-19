import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import TestPage from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'test',
    component: () => import('@/module/test')
  }, {
    path: '/gua',
    name: 'HelloWorld',
    component: () => import('@/components/HelloWorld')
  }]
})
