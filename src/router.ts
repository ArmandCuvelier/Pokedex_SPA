import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth.store'

import DeckDetail from './pages/DeckDetailPage.vue'
import DeckEdit from './pages/DeckEditPage.vue'
import DeckNew from './pages/DeckNewPage.vue'
import GamePage from './pages/GamePage.vue'
import HomePage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'
import SignUpPage from './pages/SignUpPage.vue'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signUp',
  DECK_DETAIL: '/decks/:id',
  DECK_EDIT: '/decks/:id/edit',
  DECK_NEW: '/decks/new',
  GAME: '/game',
} as const

const routes = [
  {
    path: ROUTES.HOME,
    component: HomePage,
    name: 'Home',
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.LOGIN,
    component: LoginPage,
    name: 'Login',
    meta: { guest: true },
  },
  {
    path: ROUTES.SIGNUP,
    component: SignUpPage,
    name: 'SignUp',
    meta: { guest: true },
  },
  {
    path: ROUTES.DECK_DETAIL,
    component: DeckDetail,
    name: 'DeckDetail',
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.DECK_EDIT,
    component: DeckEdit,
    name: 'EditDeck',
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.DECK_NEW,
    component: DeckNew,
    name: 'DeckNew',
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.GAME,
    component: GamePage,
    name: 'Game',
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to): string | { path: string } | undefined => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: ROUTES.LOGIN }
  }

  if (to.meta.guest && auth.isAuthenticated) {
    return { path: ROUTES.HOME }
  }

  return undefined
})

export default router
