import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ListImages from '../views/ListImages.vue'
//import Image from '../components/Image.vue'
import DrawShapes from '../views/DrawShapes.vue'
import DrawImage from '../views/DrawImage.vue'

const routes = [
  {
    path: '/images/:id',
    name: 'DrawShapes',
    component: DrawShapes,
    props: true
  },
  {
    path: '/drawimage',
    name: 'DrawImage',
    component: DrawImage,
    props: true
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path:'/images',
    name: 'ListImages',
    component: ListImages
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
