import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useApi } from '@/composables/useApi'
import type { Deck } from '@/types'

export const useDeckStore = defineStore('deck', () => {
  const { getMyDecks, deleteDeck } = useApi()

  const decks = ref<Deck[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string>('')

  async function fetchDecks() {
    loading.value = true
    error.value = ''

    try {
      decks.value = await getMyDecks()
    } catch {
      error.value = 'Impossible de charger les decks'
    } finally {
      loading.value = false
    }
  }

  async function removeDeck(id: number) {
    try {
      await deleteDeck(id)
      await fetchDecks()
    } catch {
      error.value = 'Impossible de supprimer le deck'
    }
  }

  return { decks, loading, error, fetchDecks, removeDeck }
})
