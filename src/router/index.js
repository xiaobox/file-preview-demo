import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import FilePreview from '../views/FilePreview.vue'
import ExcelPreview from '../views/ExcelPreview.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/preview',
    name: 'Preview',
    component: FilePreview
  },
  {
    path: '/excel',
    name: 'ExcelPreview',
    component: ExcelPreview
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router 