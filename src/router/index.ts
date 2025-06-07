import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EspecialistasView from '../views/EspecialistasView.vue'
import EspecialistaInactivos from '../components/EspecialistasInactivosComponent.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/especialistas', component: EspecialistasView },
  { path: '/inactivos', component: EspecialistaInactivos }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
