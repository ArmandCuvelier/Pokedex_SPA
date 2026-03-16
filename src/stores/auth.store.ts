import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '@/composables/useApi'
import { useStorage } from '@/composables/useStorage'
import type { SignInPayload, User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const { signIn, signUp } = useApi()
  const storage = useStorage()

  const user = ref<User | null>(storage.get<User>('user'))
  const appelAPI = ref<boolean>(false)
  const errorMessage = ref<string>('')

  const isAuthenticated = computed(() => user.value !== null)

  async function handleLogin(email: string, password: string) {
    appelAPI.value = true
    errorMessage.value = ''

    try {
      const payload: SignInPayload = { email, password }
      const response = await signIn(payload)
      user.value = response.user
      storage.set('token', response.token)
      storage.set('user', response.user)
      router.push('/')
    } catch {
      errorMessage.value = 'Email ou mot de passe incorrect'
    } finally {
      appelAPI.value = false
    }
  }

  async function handleSignUp(
    username: string,
    email: string,
    password: string,
  ) {
    appelAPI.value = true
    errorMessage.value = ''

    try {
      const response = await signUp({ username, email, password })
      user.value = response.user
      storage.set('token', response.token)
      storage.set('user', response.user)
      router.push('/')
    } catch {
      errorMessage.value = "Erreur lors de l'inscription"
    } finally {
      appelAPI.value = false
    }
  }

  function handleLogout() {
    user.value = null
    storage.remove('token')
    storage.remove('user')
    router.push('/login')
  }

  return {
    user,
    isAuthenticated,
    appelAPI,
    errorMessage,
    handleLogin,
    handleSignUp,
    handleLogout,
  }
})
